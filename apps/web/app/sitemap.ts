import type { MetadataRoute } from "next"

import { getDestinations, getSiteSettings, getTestimonials } from "@/lib/content"
import { absoluteUrl } from "@/lib/utils"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [destinations, site, testimonials] = await Promise.all([getDestinations(), getSiteSettings(), getTestimonials()])
  const now = new Date()
  const pages = ["/", "/about", "/services", "/destinations", "/contact", "/inquire", "/privacy"]
  if (site.testimonialsEnabled && testimonials.length) pages.push("/testimonials")
  return [
    ...pages.map((p) => ({ url: absoluteUrl(p), lastModified: now, priority: p === "/" ? 1 : 0.8 })),
    ...destinations.map((d) => ({ url: absoluteUrl(`/destinations/${d.slug}`), lastModified: now, priority: 0.7 })),
  ]
}
