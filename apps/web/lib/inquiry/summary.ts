import { tripTypeLabel, type InquiryValues } from "./schema"

export type SummaryRow = { label: string; value: string }

function list(values: string[]) {
  return values.length ? values.join(", ") : "—"
}

function formatDate(iso: string) {
  if (!iso) return ""
  const d = new Date(`${iso}T12:00:00`)
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
}

export function travelDates(v: InquiryValues) {
  if (v.flexibleDates) return `Flexible, around ${v.approxMonth}`
  return `${formatDate(v.dateFrom)} – ${formatDate(v.dateTo)}`
}

export function destinationText(v: InquiryValues) {
  if (v.destination && v.helpDeciding) return `${v.destination} (would love help deciding)`
  return v.destination || "Would love help deciding"
}

/** Every answer, in form order, for the notification email and the auto-reply recap. */
export function inquirySummary(v: InquiryValues): { section: string; rows: SummaryRow[] }[] {
  const children = Number(v.children) || 0
  return [
    {
      section: "About you",
      rows: [
        { label: "Name", value: `${v.firstName} ${v.lastName}` },
        { label: "Email", value: v.email },
        { label: "Phone", value: v.phone || "—" },
        { label: "Preferred contact", value: v.contactMethod || "—" },
        { label: "Based in", value: v.basedIn || "—" },
      ],
    },
    {
      section: "Your trip",
      rows: [
        { label: "Trip type", value: tripTypeLabel(v.tripType) },
        { label: "Destination", value: destinationText(v) },
        { label: "Travel dates", value: travelDates(v) },
        { label: "Trip length", value: v.nights ? `${v.nights} nights` : "—" },
        { label: "Adults", value: v.adults },
        { label: "Children", value: String(children) },
        ...(children > 0
          ? [{ label: "Children’s ages", value: v.childAges.slice(0, children).join(", ") }]
          : []),
        { label: "Occasion", value: v.occasion || "—" },
      ],
    },
    {
      section: "Preferences",
      rows: [
        { label: "Budget", value: v.budget },
        { label: "Accommodation", value: list(v.accommodation) },
        { label: "Pace", value: v.pace || "—" },
        { label: "Interests", value: list(v.interests) },
        { label: "Heard about us", value: v.heardFrom || "—" },
        { label: "Notes", value: v.notes || "—" },
      ],
    },
  ]
}
