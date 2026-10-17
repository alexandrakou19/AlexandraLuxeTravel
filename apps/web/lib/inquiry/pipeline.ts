// Inquiry pipeline: validate -> spam check -> notify -> auto-reply -> CRM sync.
// Each delivery step is independent: one failure never blocks the others,
// and the visitor always reaches the thank-you page once validation passes.
// A future booking or deposit flow can reuse these steps.

import { createElement } from "react"

import { ContactAutoReplyEmail, ContactNotificationEmail } from "@/emails/contact-emails"
import { InquiryAutoReplyEmail } from "@/emails/inquiry-auto-reply"
import { InquiryNotificationEmail } from "@/emails/inquiry-notification"
import { getSiteSettings } from "@/lib/content"

import { syncToCrm } from "./crm-sync"
import { mailConfig, sendEmail } from "./mailer"
import { contactSchema, inquirySchema, tripTypeLabel, type ContactValues, type InquiryValues } from "./schema"
import { checkSpam } from "./spam"
import { destinationText } from "./summary"

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
  const { notifyTo, siteUrl } = mailConfig()
  const instagram = settings.social.find((s) => s.network === "instagram")?.url

  const results = await Promise.allSettled([
    sendEmail({
      to: notifyTo,
      replyTo: values.email,
      subject: `New inquiry: ${values.firstName} ${values.lastName}, ${tripTypeLabel(values.tripType)}, ${destinationText(values)}`,
      react: createElement(InquiryNotificationEmail, { values, submittedAt: submittedAtLabel(), siteUrl }),
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

  // Without a database, the notification email is the lead's only record.
  if (results[0].status === "rejected") {
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
  const { notifyTo, siteUrl } = mailConfig()

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

  if (results[0].status === "rejected") {
    return { ok: false, message: `Something went wrong. Please try again, or email ${settings.email} directly.` }
  }
  return { ok: true }
}
