import type { ReactElement } from "react"
import { Resend } from "resend"

let client: Resend | null = null

function resend() {
  const key = process.env.RESEND_API_KEY
  if (!key) return null
  client ??= new Resend(key)
  return client
}

export const mailConfig = () => ({
  from: process.env.EMAIL_FROM ?? "Alexandra Luxe Travel <hello@alexandraluxetravel.com>",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://alexandraluxetravel.com",
})

export async function sendEmail(input: {
  to: string
  subject: string
  react: ReactElement
  replyTo?: string
}) {
  const api = resend()
  if (!api) {
    // Local development without a key: log instead of failing the visitor.
    console.warn(`[mail] RESEND_API_KEY missing, skipped "${input.subject}" to ${input.to}`)
    return { id: null, skipped: true as const }
  }
  const { data, error } = await api.emails.send({ from: mailConfig().from, ...input })
  if (error) throw new Error(`${error.name}: ${error.message}`)
  return { id: data?.id ?? null, skipped: false as const }
}
