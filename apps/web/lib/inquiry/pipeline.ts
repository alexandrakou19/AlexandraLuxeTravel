// Inquiry pipeline: validate -> spam check -> save to CMS -> notify -> auto-reply -> CRM sync.
// Each delivery step is independent: one failure never blocks the others,
// and the visitor reaches the thank-you page once the lead is saved or emailed.
// A future booking or deposit flow can reuse these steps.

import config from "@payload-config"
import { getPayload } from "payload"
import { createElement } from "react"

import { ContactAutoReplyEmail, ContactNotificationEmail } from "@/emails/contact-emails"
import { InquiryAutoReplyEmail } from "@/emails/inquiry-auto-reply"
import { InquiryNotificationEmail } from "@/emails/inquiry-notification"
import { getSiteSettings } from "@/lib/content"

import { syncToCrm } from "./crm-sync"
import { mailConfig, sendEmail } from "./mailer"
import { contactSchema, inquirySchema, tripTypeLabel, type ContactValues, type InquiryValues } from "./schema"
import { checkSpam } from "./spam"
import { destinationText, travelDates } from "./summary"

export type SubmitResult =
  | { ok: true }
  | { ok: false; message: string; fieldErrors?: Record<string, string> }

function submittedAtLabel() {
  return new Date().toLocaleString("en-US", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/New_York",
  }) + " ET"
}

function flattenErrors(issues: { path: PropertyKey[]; message: string }[]) {
  const out: Record<string, string> = {}
  for (const issue of issues) {
    const key = issue.path.map(String).join(".")
    if (!(key in out)) out[key] = issue.message
  }
  return out
}

function logFailures(kind: string, results: PromiseSettledResult<unknown>[], labels: string[]) {
  results.forEach((r, i) => {
    if (r.status === "rejected") console.error(`[${kind}] ${labels[i]} failed:`, r.reason)
  })
}

type Delivery = PromiseSettledResult<unknown>

function statusOf(r: Delivery | undefined) {
  if (!r) return "Not sent"
  if (r.status === "rejected") return `Failed: ${String((r.reason as Error)?.message ?? r.reason).slice(0, 200)}`
  return (r.value as { skipped?: boolean })?.skipped ? "Not sent (email not configured)" : "Sent"
}

/** Saves the lead in the CMS (the source of truth). Returns the record id, or null if saving failed. */
async function saveInquiry(data: Record<string, unknown>) {
  try {
    const payload = await getPayload({ config })
    const doc = await payload.create({ collection: "inquiries", data: data as never, depth: 0 })
    return doc.id
  } catch (err) {
    console.error("[inquiry] saving to the CMS failed:", err)
    return null
  }
}

async function recordDeliveries(id: number | string | null, data: Record<string, unknown>) {
  if (id == null) return
  try {
    const payload = await getPayload({ config })
    await payload.update({ collection: "inquiries", id, data: data as never, depth: 0 })
  } catch (err) {
    console.error("[inquiry] recording delivery status failed:", err)
  }
}

export async function processInquiry(raw: unknown, ip: string): Promise<SubmitResult> {
  const parsed = inquirySchema.safeParse(raw)
  if (!parsed.success) {
    return { ok: false, message: "A few answers need another look.", fieldErrors: flattenErrors(parsed.error.issues) }
  }
  const values: InquiryValues = {
    ...parsed.data,
    childAges: parsed.data.childAges.slice(0, Number(parsed.data.children) || 0),
  }

  const spam = await checkSpam({ ...values, ip })
  if (!spam.ok) {
    // Quietly accept obvious bots so they learn nothing; tell real people what to do.
    if (spam.reason === "honeypot" || spam.reason === "too-fast") return { ok: true }
    if (spam.reason === "rate-limit") return { ok: false, message: "Too many submissions in a short time. Please try again in a few minutes." }
    return { ok: false, message: "We couldn’t verify the security check. Please try again." }
  }

  const settings = await getSiteSettings()
  const { siteUrl } = mailConfig()
  const notifyTo = settings.notificationEmail
  const instagram = settings.social.find((s) => s.network === "instagram")?.url
  const children = Number(values.children) || 0

  // 1. Save first: even if every email fails, the lead is in the dashboard.
  const id = await saveInquiry({
    type: "trip",
    status: "new",
    name: `${values.firstName} ${values.lastName}`,
    firstName: values.firstName,
    lastName: values.lastName,
    email: values.email,
    phone: values.phone,
    contactMethod: values.contactMethod,
    basedIn: values.basedIn,
    tripType: values.tripType,
    destination: destinationText(values),
    travelDates: travelDates(values),
    nights: values.nights,
    adults: values.adults,
    children: String(children),
    childAges: values.childAges.join(", "),
    occasion: values.occasion,
    budget: values.budget,
    accommodation: values.accommodation.join(", "),
    pace: values.pace,
    interests: values.interests.join(", "),
    heardFrom: values.heardFrom,
    notes: values.notes,
    crm: { status: "pending" },
  })
  const adminUrl = id != null ? `${siteUrl}/admin/collections/inquiries/${id}` : undefined

  // 2. Notify, thank and sync independently; one failure never blocks the others.
  const results = await Promise.allSettled([
    sendEmail({
      to: notifyTo,
      replyTo: values.email,
      subject: `New inquiry: ${values.firstName} ${values.lastName}, ${tripTypeLabel(values.tripType)}, ${destinationText(values)}`,
      react: createElement(InquiryNotificationEmail, { values, submittedAt: submittedAtLabel(), siteUrl, adminUrl }),
    }),
    sendEmail({
      to: values.email,
      replyTo: notifyTo,
      subject: "Thank you for your inquiry · Alexandra Luxe Travel",
      react: createElement(InquiryAutoReplyEmail, {
        values,
        siteUrl,
        replyTimePromise: settings.replyTimePromise,
        instagramUrl: instagram,
      }),
    }),
    syncToCrm(values),
  ])
  logFailures("inquiry", results, ["notification", "auto-reply", "crm-sync"])

  const crm = results[2]
  await recordDeliveries(id, {
    emails: { notification: statusOf(results[0]), autoReply: statusOf(results[1]) },
    crm:
      crm.status === "rejected"
        ? { status: "failed", error: String((crm.reason as Error)?.message ?? crm.reason).slice(0, 500) }
        : { status: (crm.value as { status: string }).status, error: null },
  })

  // The visitor always reaches the thank-you page once the inquiry is saved (or at least emailed).
  if (id == null && results[0].status === "rejected") {
    return {
      ok: false,
      message: `Something went wrong sending your inquiry. Please try again, or email ${settings.email} directly.`,
    }
  }
  return { ok: true }
}

export async function processContact(raw: unknown, ip: string): Promise<SubmitResult> {
  const parsed = contactSchema.safeParse(raw)
  if (!parsed.success) {
    return { ok: false, message: "A few fields need another look.", fieldErrors: flattenErrors(parsed.error.issues) }
  }
  const values: ContactValues = parsed.data

  const spam = await checkSpam({ ...values, ip })
  if (!spam.ok) {
    if (spam.reason === "honeypot" || spam.reason === "too-fast") return { ok: true }
    if (spam.reason === "rate-limit") return { ok: false, message: "Too many messages in a short time. Please try again in a few minutes." }
    return { ok: false, message: "We couldn’t verify the security check. Please try again." }
  }

  const settings = await getSiteSettings()
  const { siteUrl } = mailConfig()
  const notifyTo = settings.notificationEmail

  // Saved like trip inquiries, but never sent to TravelJoy.
  const id = await saveInquiry({
    type: "contact",
    status: "new",
    name: values.name,
    email: values.email,
    message: values.message,
    crm: { status: "na" },
  })

  const results = await Promise.allSettled([
    sendEmail({
      to: notifyTo,
      replyTo: values.email,
      subject: `Contact message: ${values.name}`,
      react: createElement(ContactNotificationEmail, { values, submittedAt: submittedAtLabel(), siteUrl }),
    }),
    sendEmail({
      to: values.email,
      replyTo: notifyTo,
      subject: "Thank you for your message · Alexandra Luxe Travel",
      react: createElement(ContactAutoReplyEmail, { values, siteUrl, replyTimePromise: settings.replyTimePromise }),
    }),
  ])
  logFailures("contact", results, ["notification", "auto-reply"])
  await recordDeliveries(id, { emails: { notification: statusOf(results[0]), autoReply: statusOf(results[1]) } })

  if (id == null && results[0].status === "rejected") {
    return { ok: false, message: `Something went wrong. Please try again, or email ${settings.email} directly.` }
  }
  return { ok: true }
}
