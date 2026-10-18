// The single seam between pages and content. Everything comes from Payload CMS
// (Local API, no HTTP) and is mapped to the view-model types in content/types.ts,
// so components never depend on CMS field names. Draft content is used only
// while Alexandra is previewing (Next.js draft mode).

import config from "@payload-config"
import { draftMode } from "next/headers"
import { getPayload } from "payload"
import { cache } from "react"

import { brand } from "@/content/media"
import type {
  AboutPage,
  ContactPage,
  Credential,
  Destination,
  HomePage,
  InquiryPage,
  Media,
  NavItem,
  SeoMeta,
  Service,
  ServicesPage,
  SiteSettings,
  SocialLink,
  Testimonial,
} from "@/content/types"
import type {
  Destination as DestinationDoc,
  Media as MediaDoc,
  PrivacyPolicy as PrivacyDoc,
  Service as ServiceDoc,
} from "@/payload-types"

/* ---------- Payload + draft mode ---------- */

const payload = cache(() => getPayload({ config }))

async function isDraft() {
  try {
    return (await draftMode()).isEnabled
  } catch {
    // Outside a request (e.g. generateStaticParams at build time).
    return false
  }
}

/* ---------- mappers ---------- */

type Rel<T> = number | T | null | undefined

const fallbackImage: Media = { id: "missing", src: "/images/brand/logo-email.png", width: 480, height: 145, alt: "" }

/** Local uploads come back as absolute URLs on our own host; next/image wants them relative. */
function mediaSrc(url: string) {
  return url.replace(/^https?:\/\/[^/]+(?=\/api\/media\/file\/)/, "")
}

function toMedia(rel: Rel<MediaDoc>): Media {
  if (!rel || typeof rel === "number" || !rel.url) return fallbackImage
  return {
    id: String(rel.id),
    src: mediaSrc(rel.url),
    width: rel.width ?? 1600,
    height: rel.height ?? 1200,
    alt: rel.alt ?? "",
    caption: rel.caption ?? undefined,
    credit: rel.credit ?? undefined,
    isStock: Boolean(rel.isStock),
    blur: rel.blurDataURL ?? undefined,
    focal: rel.focalX != null && rel.focalY != null ? `${rel.focalX}% ${rel.focalY}%` : undefined,
  }
}

const toMediaList = (list: Rel<MediaDoc>[] | null | undefined) =>
  (list ?? []).map(toMedia).filter((m) => m !== fallbackImage)

/** Textareas use a blank line between paragraphs. */
const paragraphs = (text: string | null | undefined) =>
  (text ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)

const items = (list: { item: string }[] | null | undefined) => (list ?? []).map((i) => i.item)

function toSeo(meta: { title?: string | null; description?: string | null; image?: Rel<MediaDoc> } | undefined): SeoMeta {
  return {
    title: meta?.title || undefined,
    description: meta?.description || undefined,
    image: meta?.image && typeof meta.image !== "number" ? toMedia(meta.image) : undefined,
  }
}

function toService(doc: ServiceDoc): Service {
  return {
    id: String(doc.id),
    anchor: doc.anchor,
    title: doc.title,
    shortTitle: doc.shortTitle,
    summary: doc.summary,
    body: paragraphs(doc.body),
    included: items(doc.included),
    idealFor: doc.idealFor,
    image: toMedia(doc.image),
    tripType: doc.tripType,
    order: doc.order,
  }
}

function toDestination(doc: DestinationDoc): Destination & { seo: SeoMeta } {
  return {
    slug: doc.slug,
    title: doc.title,
    region: doc.region,
    tags: doc.tags ?? [],
    featured: Boolean(doc.featured),
    cover: toMedia(doc.cover),
    teaser: doc.teaser,
    intro: paragraphs(doc.intro),
    places: (doc.places ?? []).map((p) => p.name),
    bestTime: doc.bestTime,
    signatureExperiences: items(doc.signatureExperiences),
    perfectFor: items(doc.perfectFor),
    gallery: toMediaList(doc.gallery),
    related: (doc.related ?? []).map((r) => (typeof r === "number" ? "" : r.slug)).filter(Boolean),
    seo: toSeo(doc.meta),
  }
}

/* ---------- site settings ---------- */

const socialLabels: Record<SocialLink["network"], string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  pinterest: "Pinterest",
  tiktok: "TikTok",
}

// Structural parts of the site that are not content (kept in code).
const nav: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Destinations", href: "/destinations" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Contact", href: "/contact" },
]

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const p = await payload()
  const [doc, testimonialCount] = await Promise.all([
    p.findGlobal({ slug: "site-settings", depth: 1 }),
    p.count({ collection: "testimonials", where: { _status: { equals: "published" } } }),
  ])
  const testimonialsEnabled = Boolean(doc.testimonialsEnabled) && testimonialCount.totalDocs > 0
  return {
    name: "Alexandra Luxe Travel",
    shortName: "Alexandra",
    tagline: doc.tagline,
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://alexandraluxetravel.com",
    logo: brand("logo-full"),
    monogram: brand("logo-monogram"),
    email: doc.email,
    social: (doc.social ?? []).map(
      (s): SocialLink => ({
        network: s.network,
        label: socialLabels[s.network],
        url: s.url,
        handle: s.handle ?? undefined,
      })
    ),
    credentials: (doc.credentials ?? []).map(
      (c, i): Credential => ({ id: c.id ?? String(i), name: c.name, logo: c.logo ? toMedia(c.logo) : undefined })
    ),
    testimonialsEnabled,
    replyTimePromise: doc.replyTimePromise,
    notificationEmail: doc.notificationEmail,
    // Hide the Testimonials nav item while testimonials are off or empty.
    nav: testimonialsEnabled ? nav : nav.filter((n) => n.href !== "/testimonials"),
    // Header CTAs are data-driven so a future "Book" button can be added.
    headerCta: { label: "Inquire", href: "/inquire" },
    defaultSeoImage: toMedia(doc.defaultSeoImage),
  }
})

/* ---------- pages ---------- */

export const getServicesPage = cache(async (): Promise<ServicesPage & { amenities: string[]; processSteps: { title: string; body: string }[]; seo: SeoMeta }> => {
  const doc = await (await payload()).findGlobal({ slug: "services-page", depth: 1, draft: await isDraft() })
  return {
    intro: doc.intro,
    styles: doc.styles,
    planningFee: doc.planningFee,
    processIntro: doc.processIntro,
    amenities: items(doc.amenities),
    processSteps: (doc.processSteps ?? []).map(({ title, body }) => ({ title, body })),
    seo: toSeo(doc.meta),
  }
})

export const getHomePage = cache(async (): Promise<HomePage & { seo: SeoMeta }> => {
  const [doc, servicesPage] = await Promise.all([
    (await payload()).findGlobal({ slug: "home-page", depth: 2, draft: await isDraft() }),
    getServicesPage(),
  ])
  return {
    hero: {
      image: toMedia(doc.heroImage),
      headline: doc.heroHeadline,
      headlineAccent: doc.heroHeadlineAccent,
      subhead: doc.heroSubhead,
    },
    meet: {
      portrait: toMedia(doc.meetPortrait),
      secondary: toMedia(doc.meetSecondary),
      heading: doc.meetHeading,
      body: paragraphs(doc.meetBody),
    },
    stats: (doc.stats ?? []).map((s) => ({ value: s.value, suffix: s.suffix ?? "", label: s.label })),
    signature: {
      images: [toMedia(doc.signatureImage), toMedia(doc.signatureImage2)],
      eyebrow: doc.signatureEyebrow,
      heading: doc.signatureHeading,
      body: paragraphs(doc.signatureBody),
    },
    journeys: {
      heading: doc.journeysHeading,
      intro: doc.journeysIntro,
      items: (doc.journeys ?? []).map((j) => ({
        title: j.title,
        line: j.line,
        href: typeof j.service === "number" ? "/services" : `/services#${j.service.anchor}`,
        image: toMedia(j.image),
      })),
    },
    amenities: servicesPage.amenities,
    planningFeeLine: servicesPage.planningFee,
    process: { heading: doc.processHeading, intro: doc.processIntro, steps: servicesPage.processSteps },
    destinations: { heading: doc.destinationsHeading, intro: doc.destinationsIntro },
    instagram: { heading: doc.instagramHeading, images: toMediaList(doc.instagramImages) },
    closing: { heading: doc.closingHeading, body: doc.closingBody, image: toMedia(doc.closingImage) },
    seo: toSeo(doc.meta),
  }
})

export const getAboutPage = cache(async (): Promise<AboutPage & { seo: SeoMeta }> => {
  const doc = await (await payload()).findGlobal({ slug: "about-page", depth: 1, draft: await isDraft() })
  return {
    portrait: toMedia(doc.portrait),
    headline: doc.headline,
    intro: doc.intro,
    story: paragraphs(doc.story),
    family: {
      heading: doc.family.heading,
      body: paragraphs(doc.family.body),
      image: toMedia(doc.family.image),
      image2: doc.family.image2 ? toMedia(doc.family.image2) : undefined,
    },
    philosophy: (doc.philosophy ?? []).map(({ title, body }) => ({ title, body })),
    gallery: toMediaList(doc.gallery),
    seo: toSeo(doc.meta),
  }
})

export const getContactPage = cache(async (): Promise<ContactPage> => {
  const doc = await (await payload()).findGlobal({ slug: "contact-page", depth: 0 })
  return { intro: doc.intro, panelHeading: doc.panelHeading, panelBody: doc.panelBody }
})

export const getInquiryPage = cache(async (): Promise<InquiryPage> => {
  const doc = await (await payload()).findGlobal({ slug: "inquiry-page", depth: 0 })
  return {
    intro: doc.intro,
    budgetRanges: (doc.budgetRanges ?? []).map((b) => b.label),
    thankYou: {
      heading: doc.thankYou.heading,
      body: doc.thankYou.body,
      nextSteps: (doc.thankYou.nextSteps ?? []).map(({ title, body }) => ({ title, body })),
    },
  }
})

export const getPrivacyPolicy = cache(async (): Promise<Pick<PrivacyDoc, "intro" | "content" | "lastUpdated">> => {
  const doc = await (await payload()).findGlobal({ slug: "privacy-policy", depth: 0 })
  return { intro: doc.intro, content: doc.content, lastUpdated: doc.lastUpdated }
})

/* ---------- collections ---------- */

export const getServices = cache(async (): Promise<Service[]> => {
  const res = await (await payload()).find({ collection: "services", sort: "order", depth: 1, limit: 50, draft: await isDraft() })
  return res.docs.map(toService)
})

export const getDestinations = cache(async () => {
  const res = await (await payload()).find({ collection: "destinations", sort: "createdAt", depth: 1, limit: 200, draft: await isDraft() })
  return res.docs.map(toDestination)
})

export async function getFeaturedDestinations() {
  return (await getDestinations()).filter((d) => d.featured)
}

export async function getDestination(slug: string) {
  const res = await (await payload()).find({
    collection: "destinations",
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
    draft: await isDraft(),
  })
  return res.docs[0] ? toDestination(res.docs[0]) : undefined
}

export async function getRelatedDestinations(destination: Destination) {
  const all = await getDestinations()
  return destination.related
    .map((slug) => all.find((d) => d.slug === slug))
    .filter((d): d is NonNullable<typeof d> => Boolean(d))
    .slice(0, 3)
}

/** Empty when testimonials are toggled off, so sections hide themselves. */
export async function getTestimonials({ featuredOnly = false } = {}): Promise<Testimonial[]> {
  const site = await getSiteSettings()
  if (!site.testimonialsEnabled) return []
  const res = await (await payload()).find({
    collection: "testimonials",
    where: featuredOnly ? { featured: { equals: true } } : undefined,
    sort: "order",
    depth: 0,
    limit: 100,
    draft: await isDraft(),
  })
  return res.docs.map((t) => ({
    id: String(t.id),
    quote: t.quote,
    clientName: t.clientName,
    trip: t.trip,
    tripType: t.tripType ?? undefined,
    featured: Boolean(t.featured),
    order: t.order ?? 0,
  }))
}
