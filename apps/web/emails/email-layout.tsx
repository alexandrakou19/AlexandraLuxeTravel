import { Body, Container, Head, Hr, Html, Img, Link, Preview, Section, Text } from "@react-email/components"
import type { ReactNode } from "react"

import type { SummaryRow } from "@/lib/inquiry/summary"

export const palette = {
  ivory: "#F7F3EE",
  sand: "#E6DCCF",
  champagne: "#C8B89E",
  charcoal: "#3B3734",
  deepTaupe: "#6E655B",
  white: "#FFFFFF",
}

const serif = "'Cormorant Garamond', Georgia, 'Times New Roman', serif"
const sans = "Jost, 'Helvetica Neue', Helvetica, Arial, sans-serif"

export const styles = {
  heading: { fontFamily: serif, fontSize: "32px", lineHeight: "1.15", fontWeight: 500, color: palette.charcoal, margin: "0 0 16px" },
  subheading: { fontFamily: serif, fontSize: "22px", lineHeight: "1.3", fontWeight: 500, color: palette.charcoal, margin: "28px 0 8px" },
  body: { fontFamily: sans, fontSize: "16px", lineHeight: "1.7", color: palette.charcoal, margin: "0 0 16px" },
  muted: { fontFamily: sans, fontSize: "13px", lineHeight: "1.6", color: palette.deepTaupe, margin: "0" },
  eyebrow: { fontFamily: sans, fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase" as const, color: palette.deepTaupe, margin: "0 0 12px" },
  button: {
    display: "inline-block",
    backgroundColor: palette.charcoal,
    color: palette.ivory,
    fontFamily: sans,
    fontSize: "12px",
    letterSpacing: "0.18em",
    textTransform: "uppercase" as const,
    padding: "14px 26px",
    textDecoration: "none",
    borderRadius: "2px",
  },
  link: { color: palette.charcoal, textDecoration: "underline", textDecorationColor: palette.champagne },
}

export function EmailLayout({
  preview,
  siteUrl,
  children,
  footer,
}: {
  preview: string
  siteUrl: string
  children: ReactNode
  footer?: ReactNode
}) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ backgroundColor: palette.ivory, margin: 0, padding: "32px 0" }}>
        <Container style={{ maxWidth: "600px", margin: "0 auto", backgroundColor: palette.white, border: `1px solid ${palette.sand}` }}>
          <Section style={{ padding: "36px 40px 20px", textAlign: "center" as const }}>
            <Link href={siteUrl}>
              <Img
                src={`${siteUrl}/images/brand/logo-email.png`}
                alt="Alexandra Luxe Travel"
                width="220"
                style={{ margin: "0 auto", display: "block" }}
              />
            </Link>
          </Section>
          <Section style={{ padding: "0 40px" }}>
            <Hr style={{ borderColor: palette.champagne, borderWidth: "1px 0 0", margin: 0, width: "100%" }} />
          </Section>
          <Section style={{ padding: "32px 40px 36px" }}>{children}</Section>
          <Section style={{ backgroundColor: palette.charcoal, padding: "24px 40px" }}>
            <Text style={{ ...styles.muted, color: palette.sand, textAlign: "center" as const }}>
              {footer ?? "Alexandra Luxe Travel · Luxury family travel and once-in-a-lifetime journeys"}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export function SummaryTable({ sections }: { sections: { section: string; rows: SummaryRow[] }[] }) {
  return (
    <>
      {sections.map((s) => (
        <Section key={s.section} style={{ margin: "0 0 8px" }}>
          <Text style={styles.subheading}>{s.section}</Text>
          <table width="100%" cellPadding={0} cellSpacing={0} role="presentation" style={{ borderCollapse: "collapse" }}>
            <tbody>
              {s.rows.map((row) => (
                <tr key={row.label}>
                  <td
                    style={{
                      ...styles.muted,
                      width: "38%",
                      padding: "9px 12px 9px 0",
                      borderBottom: `1px solid ${palette.sand}`,
                      verticalAlign: "top",
                    }}
                  >
                    {row.label}
                  </td>
                  <td
                    style={{
                      ...styles.body,
                      fontSize: "15px",
                      margin: 0,
                      padding: "9px 0",
                      borderBottom: `1px solid ${palette.sand}`,
                      verticalAlign: "top",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {row.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      ))}
    </>
  )
}
