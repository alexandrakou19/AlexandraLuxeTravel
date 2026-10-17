import type { MetadataRoute } from "next"

import { absoluteUrl } from "@/lib/utils"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/inquire/thank-you", "/admin"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
  }
}
