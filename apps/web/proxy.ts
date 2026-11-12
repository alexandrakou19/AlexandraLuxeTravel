import { NextResponse } from "next/server"
import type { NextFetchEvent, NextRequest } from "next/server"

/**
 * Utah visitor alert (edge proxy).
 *
 * Vercel attaches the requester's coarse IP geolocation to every request as
 * headers (country, region, city). The visitor's IP address itself is never
 * read or stored. When a public page view comes from Utah, this emails the
 * site's alert address once per visitor per day (deduped with a cookie)
 * using the existing Resend setup.
 *
 * Disabled unless GEO_ALERT_TO is set (e.g. the inquiry notification email
 * from Site Settings). RESEND_API_KEY and EMAIL_FROM are already configured.
 */

const ALERT_COUNTRY = "US"
const ALERT_REGION = "UT"
const ALERT_COOKIE = "alt_geo_alert"
const ONE_DAY_SECONDS = 60 * 60 * 24

async function sendUtahAlert(city: string | null, path: string) {
  const to = process.env.GEO_ALERT_TO
  const apiKey = process.env.RESEND_API_KEY
  if (!to || !apiKey) return
  const from = process.env.EMAIL_FROM ?? "Alexandra Luxe Travel <hello@alexandraluxetravel.com>"
  const where = city ? `${city}, Utah` : "Utah"
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to,
      subject: `Website visitor from ${where}`,
      text: [
        `Someone in ${where} (approximate, based on their internet connection) just viewed ${path} on alexandraluxetravel.com.`,
        "",
        "Only one alert is sent per visitor per day. Location is approximate: it can be off by a city or two, and VPNs or mobile carriers can make a visitor appear to be somewhere they are not.",
      ].join("\n"),
    }),
  }).catch(() => {})
}

export function proxy(request: NextRequest, event: NextFetchEvent) {
  const response = NextResponse.next()

  if (request.method !== "GET") return response
  if (!request.headers.get("accept")?.includes("text/html")) return response
  if (request.headers.get("x-vercel-ip-country") !== ALERT_COUNTRY) return response
  if (request.headers.get("x-vercel-ip-country-region") !== ALERT_REGION) return response
  if (request.cookies.has(ALERT_COOKIE)) return response

  let city: string | null = null
  try {
    const raw = request.headers.get("x-vercel-ip-city")
    if (raw) city = decodeURIComponent(raw)
  } catch {
    city = null
  }

  event.waitUntil(sendUtahAlert(city, request.nextUrl.pathname))
  response.cookies.set(ALERT_COOKIE, "1", { maxAge: ONE_DAY_SECONDS, httpOnly: true, sameSite: "lax" })
  return response
}

export const config = {
  // Public pages only: skip the CMS admin, API routes, and static assets.
  matcher: ["/((?!admin|api|_next/static|_next/image|images|icon.png|favicon.ico).*)"],
}
