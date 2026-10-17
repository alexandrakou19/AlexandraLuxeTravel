// Spam protection: honeypot, minimum fill time, optional Cloudflare Turnstile,
// and a best-effort in-memory rate limit (per server instance).

const MIN_FILL_MS = 2500
const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 5
const hits = new Map<string, number[]>()

export type SpamCheck = { ok: true } | { ok: false; reason: "honeypot" | "too-fast" | "turnstile" | "rate-limit" }

export async function checkSpam({
  company,
  startedAt,
  turnstileToken,
  ip,
}: {
  company?: string
  startedAt: number
  turnstileToken?: string
  ip: string
}): Promise<SpamCheck> {
  if (company) return { ok: false, reason: "honeypot" }
  if (!startedAt || Date.now() - startedAt < MIN_FILL_MS) return { ok: false, reason: "too-fast" }

  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  if (recent.length >= MAX_PER_WINDOW) return { ok: false, reason: "rate-limit" }
  recent.push(now)
  hits.set(ip, recent)

  const secret = process.env.TURNSTILE_SECRET_KEY
  if (secret) {
    if (!turnstileToken) return { ok: false, reason: "turnstile" }
    try {
      const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        body: new URLSearchParams({ secret, response: turnstileToken, remoteip: ip }),
        signal: AbortSignal.timeout(5000),
      })
      const data = (await res.json()) as { success: boolean }
      if (!data.success) return { ok: false, reason: "turnstile" }
    } catch {
      return { ok: false, reason: "turnstile" }
    }
  }
  return { ok: true }
}
