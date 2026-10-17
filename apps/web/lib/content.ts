// The single seam between pages and content. Today it reads typed local
// content; with Payload CMS it becomes `getPayload({ config })` Local API
// calls returning the same shapes. Pages never import from /content directly.

import { destinations } from "@/content/destinations"
import { aboutPage, homePage, inquiryPage, servicesPage } from "@/content/pages"
import { services } from "@/content/services"
import { siteSettings, testimonials } from "@/content/site"
import type { Destination } from "@/content/types"

export async function getSiteSettings() {
  // Hide the Testimonials nav item while testimonials are toggled off.
  if (siteSettings.testimonialsEnabled && testimonials.length) return siteSettings
  return { ...siteSettings, nav: siteSettings.nav.filter((item) => item.href !== "/testimonials") }
}

export async function getHomePage() {
  return homePage
}

export async function getAboutPage() {
  return aboutPage
}

export async function getServicesPage() {
  return servicesPage
}

export async function getInquiryPage() {
  return inquiryPage
}

export async function getServices() {
  return [...services].sort((a, b) => a.order - b.order)
}

export async function getDestinations() {
  return destinations
}

export async function getFeaturedDestinations() {
  return destinations.filter((d) => d.featured)
}

export async function getDestination(slug: string): Promise<Destination | undefined> {
  return destinations.find((d) => d.slug === slug)
}

export async function getRelatedDestinations(destination: Destination) {
  return destination.related
    .map((slug) => destinations.find((d) => d.slug === slug))
    .filter((d): d is Destination => Boolean(d))
    .slice(0, 3)
}

/** Empty when testimonials are toggled off, so sections hide themselves. */
export async function getTestimonials({ featuredOnly = false } = {}) {
  if (!siteSettings.testimonialsEnabled) return []
  return testimonials
    .filter((t) => (featuredOnly ? t.featured : true))
    .sort((a, b) => a.order - b.order)
}
