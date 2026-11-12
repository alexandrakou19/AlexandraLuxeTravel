import { NextResponse } from "next/server"
import type { NextFetchEvent, NextRequest } from "next/server"

/**
 * Visitor location alerts (edge proxy).
 *
 * Vercel attaches the requester's coarse IP geolocation to every request as
 * headers (country, region, city). The visitor's IP address itself is never
 * read or stored. When a public page view matches a watched place, this
 * emails the site's alert address once per visitor per day (deduped with a
 * cookie) using the existing Resend setup.
 *
 * Watched places: Utah (any city), and Lawrence or Greenfield, Indiana.
 *
 * Disabled unless GEO_ALERT_TO is set (e.g. the inquiry notification email
 * from Site Settings). RESEND_API_KEY and EMAIL_FROM are already configured.
 */

const ALERT_COOKIE = "alt_geo_alert"
const ONE_DAY_SECONDS = 60 * 60 * 24
const INDIANA_ALERT_CITIES = new Set(["lawrence", "greenfield"])

function watchedPlace(country: string | null, region: string | null, city: string | null): string | null {
  if (country !== "US") return null
  if (region === "UT") return city ? `${city}, Utah` : "Utah"
  if (region === "IN" && city && INDIANA_ALERT_CITIES.has(city.toLowerCase())) return `${city}, Indiana`
  return null
}

async function sendGeoAlert(where: string, path: string) {
  const to = process.env.GEO_ALERT_TO
  const apiKey = process.env.RESEND_API_KEY
  if (!to || !apiKey) return
  const from = process.env.EMAIL_FROM ?? "Alexandra Luxe Travel <hello@alexandraluxetravel.com>"
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
  if (request.cookies.has(ALERT_COOKIE)) return response

  let city: string | null = null
  try {
    const raw = request.headers.get("x-vercel-ip-city")
    if (raw) city = decodeURIComponent(raw)
  } catch {
    city = null
  }

  const where = watchedPlace(
    request.headers.get("x-vercel-ip-country"),
    request.headers.get("x-vercel-ip-country-region"),
    city,
  )
  if (!where) return response

  event.waitUntil(sendGeoAlert(where, request.nextUrl.pathname))
  response.cookies.set(ALERT_COOKIE, "1", { maxAge: ONE_DAY_SECONDS, httpOnly: true, sameSite: "lax" })
  return response
}

export const config = {
  // Public pages only: skip the CMS admin, API routes, and static assets.
  matcher: ["/((?!admin|api|_next/static|_next/image|images|icon.png|favicon.ico).*)"],
}
