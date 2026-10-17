import { Link, Text } from "@react-email/components"

import { tripTypeLabel, type InquiryValues } from "@/lib/inquiry/schema"
import { destinationText, inquirySummary, travelDates } from "@/lib/inquiry/summary"

import { EmailLayout, styles, SummaryTable } from "./email-layout"

export function InquiryNotificationEmail({
  values,
  submittedAt,
  siteUrl,
}: {
  values: InquiryValues
  submittedAt: string
  siteUrl: string
}) {
  return (
    <EmailLayout
      siteUrl={siteUrl}
      preview={`${values.firstName} ${values.lastName} · ${tripTypeLabel(values.tripType)} · ${destinationText(values)}`}
      footer="Reply to this email to answer the traveler directly."
    >
      <Text style={styles.eyebrow}>New trip inquiry</Text>
      <Text style={styles.heading}>
        {values.firstName} {values.lastName}
      </Text>
      <Text style={styles.body}>
        {tripTypeLabel(values.tripType)} · {destinationText(values)} · {travelDates(values)}
      </Text>
      <Text style={styles.muted}>
        Submitted {submittedAt} · <Link href={`mailto:${values.email}`} style={styles.link}>{values.email}</Link>
      </Text>
      <SummaryTable sections={inquirySummary(values)} />
    </EmailLayout>
  )
}
