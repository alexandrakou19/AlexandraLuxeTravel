import config from "@payload-config"
import { draftMode } from "next/headers"
import { redirect } from "next/navigation"
import { getPayload } from "payload"

/** Turns on draft mode for signed-in editors so the site shows unpublished changes (Live Preview). */
export async function GET(request: Request) {
  const url = new URL(request.url)
  const path = url.searchParams.get("path") || "/"
  if (!path.startsWith("/") || path.startsWith("//")) return new Response("Invalid path", { status: 400 })

  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: request.headers })
  if (!user) return new Response("Please sign in to the dashboard to preview changes.", { status: 403 })

  ;(await draftMode()).enable()
  redirect(path)
}
