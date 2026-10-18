import { Button, Link, Section, Text } from "@react-email/components"

import { tripTypeLabel, type InquiryValues } from "@/lib/inquiry/schema"
import { destinationText, inquirySummary, travelDates } from "@/lib/inquiry/summary"

import { EmailLayout, styles, SummaryTable } from "./email-layout"

export function InquiryNotificationEmail({
  values,
  submittedAt,
  siteUrl,
  adminUrl,
}: {
  values: InquiryValues
  submittedAt: string
  siteUrl: string
  /** Link to this inquiry in the CMS dashboard. */
  adminUrl?: string
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
      {adminUrl ? (
        <Section style={{ margin: "24px 0 8px" }}>
          <Button href={adminUrl} style={styles.button}>
            Open in dashboard
          </Button>
        </Section>
      ) : null}
      <SummaryTable sections={inquirySummary(values)} />
    </EmailLayout>
  )
}
