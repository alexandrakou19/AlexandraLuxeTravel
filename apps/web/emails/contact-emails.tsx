import { Link, Text } from "@react-email/components"

import type { ContactValues } from "@/lib/inquiry/schema"

import { EmailLayout, palette, styles, SummaryTable } from "./email-layout"

export function ContactNotificationEmail({
  values,
  submittedAt,
  siteUrl,
}: {
  values: ContactValues
  submittedAt: string
  siteUrl: string
}) {
  return (
    <EmailLayout siteUrl={siteUrl} preview={`Contact message from ${values.name}`} footer="Reply to this email to answer directly.">
      <Text style={styles.eyebrow}>Contact message</Text>
      <Text style={styles.heading}>{values.name}</Text>
      <Text style={styles.muted}>
        Submitted {submittedAt} · <Link href={`mailto:${values.email}`} style={styles.link}>{values.email}</Link>
      </Text>
      <SummaryTable
        sections={[
          {
            section: "Message",
            rows: [
              { label: "Name", value: values.name },
              { label: "Email", value: values.email },
              { label: "Message", value: values.message },
            ],
          },
        ]}
      />
    </EmailLayout>
  )
}

export function ContactAutoReplyEmail({
  values,
  siteUrl,
  replyTimePromise,
}: {
  values: ContactValues
  siteUrl: string
  replyTimePromise: string
}) {
  const firstName = values.name.split(" ")[0]
  return (
    <EmailLayout siteUrl={siteUrl} preview={`Thank you for your message, ${firstName}.`}>
      <Text style={styles.heading}>Thank you, {firstName}.</Text>
      <Text style={styles.body}>
        Your message is with me and I’ll reply {replyTimePromise}. If you’re planning a trip, the{" "}
        <Link href={`${siteUrl}/inquire`} style={styles.link}>
          travel inquiry form
        </Link>{" "}
        helps me prepare something wonderful even faster.
      </Text>
      <Text style={{ ...styles.body, fontStyle: "italic", color: palette.deepTaupe }}>Warmly, Alexandra</Text>
    </EmailLayout>
  )
}
