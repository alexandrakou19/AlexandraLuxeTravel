import { Button, Link, Section, Text } from "@react-email/components"

import type { InquiryValues } from "@/lib/inquiry/schema"
import { inquirySummary } from "@/lib/inquiry/summary"

import { EmailLayout, palette, styles, SummaryTable } from "./email-layout"

export function InquiryAutoReplyEmail({
  values,
  siteUrl,
  replyTimePromise,
  instagramUrl,
}: {
  values: InquiryValues
  siteUrl: string
  replyTimePromise: string
  instagramUrl?: string
}) {
  return (
    <EmailLayout siteUrl={siteUrl} preview={`Thank you, ${values.firstName}. Your journey has begun.`}>
      <Text style={styles.eyebrow}>Your inquiry is in</Text>
      <Text style={styles.heading}>Thank you, {values.firstName}.</Text>
      <Text style={styles.body}>
        I’m so glad you reached out. I read every inquiry personally, and I’ll be in touch {replyTimePromise} with a few
        thoughts and any questions I have.
      </Text>
      <Text style={styles.subheading}>What happens next</Text>
      <Text style={styles.body}>
        1. I review your answers: your dates, destinations and wishes.
        <br />
        2. I reach out personally to talk through the details.
        <br />
        3. I prepare a first draft of your trip, ready for us to shape together.
      </Text>
      <Section style={{ margin: "24px 0 8px" }}>
        <Button href={`${siteUrl}/destinations`} style={styles.button}>
          Explore destinations
        </Button>
      </Section>
      <Text style={{ ...styles.body, marginTop: "28px" }}>
        In the meantime, simply reply to this email if you think of anything else.
      </Text>
      <Text style={{ ...styles.body, fontStyle: "italic", color: palette.deepTaupe }}>Warmly, Alexandra</Text>
      <Text style={{ ...styles.eyebrow, marginTop: "32px" }}>A summary of your answers</Text>
      <SummaryTable sections={inquirySummary(values)} />
      {instagramUrl ? (
        <Text style={{ ...styles.muted, marginTop: "24px" }}>
          Follow along on{" "}
          <Link href={instagramUrl} style={styles.link}>
            Instagram
          </Link>
          .
        </Text>
      ) : null}
    </EmailLayout>
  )
}
