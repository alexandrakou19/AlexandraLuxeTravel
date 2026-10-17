import type { InquiryValues } from "./schema"
import { destinationText, inquirySummary, travelDates } from "./summary"
import { tripTypeLabel } from "./schema"

// Website -> Zapier "Catch Hook" -> TravelJoy "Create New Trip With a New or Existing Client".
// Runs only when ZAPIER_TRAVELJOY_HOOK_URL is set; a slow Zapier never delays the visitor.
export async function syncToCrm(values: InquiryValues) {
  const url = process.env.ZAPIER_TRAVELJOY_HOOK_URL
  if (!url) return { status: "skipped" as const }

  const month = values.flexibleDates
    ? values.approxMonth
    : new Date(`${values.dateFrom}T12:00:00`).toLocaleDateString("en-US", { month: "long", year: "numeric" })

  const notes = inquirySummary(values)
    .flatMap((s) => s.rows.map((r) => `${r.label}: ${r.value}`))
    .join("\n")

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phone: values.phone,
      tripName: `${tripTypeLabel(values.tripType)}: ${destinationText(values)} (${month})`,
      travelDates: travelDates(values),
      notes,
    }),
    signal: AbortSignal.timeout(4000),
  })
  if (!res.ok) throw new Error(`Zapier responded ${res.status}`)
  return { status: "sent" as const }
}
