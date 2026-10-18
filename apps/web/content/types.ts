// Content model. Shapes mirror the Payload CMS collections and globals in the
// developer brief (section 6) so lib/content.ts can later swap to Payload's
// Local API without touching any page or component.

export type Media = {
  id: string
  src: string
  width: number
  height: number
  /** Required, like the CMS: every image needs meaningful alt text. */
  alt: string
  /** Magazine-style credit line shown under editorial photos. */
  caption?: string
  /** Source URL for stock images (never presented as her trips). */
  credit?: string
  isStock?: boolean
  blur?: string
  /** CSS object-position, e.g. "50% 30%". Mirrors Payload's focal point. */
  focal?: string
}

export type ExperienceTag = "family" | "adventure" | "culture" | "beach" | "group"

export type TripType =
  | "family"
  | "honeymoon"
  | "romantic"
  | "wedding"
  | "group"
  | "adventure"
  | "other"

export type Service = {
  id: string
  /** Stable anchor id on /services, e.g. "family" -> /services#family */
  anchor: string
  title: string
  shortTitle: string
  summary: string
  body: string[]
  included: string[]
  idealFor: string
  image: Media
  /** Value preselected in the inquiry form via ?trip= */
  tripType: TripType
  order: number
}

export type Destination = {
  slug: string
  title: string
  region: string
  tags: ExperienceTag[]
  featured: boolean
  cover: Media
  teaser: string
  intro: string[]
  places: string[]
  bestTime: string
  signatureExperiences: string[]
  perfectFor: string[]
  gallery: Media[]
  related: string[]
  seo?: { title?: string; description?: string }
}

export type Testimonial = {
  id: string
  quote: string
  clientName: string
  trip: string
  tripType?: TripType
  featured: boolean
  order: number
}

export type SocialLink = {
  network: "instagram" | "facebook" | "pinterest" | "tiktok"
  label: string
  url: string
  handle?: string
}

export type Credential = {
  id: string
  name: string
  logo?: Media
}

export type NavItem = { label: string; href: string }

export type SiteSettings = {
  name: string
  shortName: string
  tagline: string
  url: string
  logo: Media
  monogram: Media
  email: string
  social: SocialLink[]
  credentials: Credential[]
  testimonialsEnabled: boolean
  replyTimePromise: string
  /** Inbox that receives inquiries (not shown on the site). */
  notificationEmail: string
  nav: NavItem[]
  /** Header CTAs are data-driven so a future "Book" button can be added. */
  headerCta: NavItem
  defaultSeoImage: Media
}

export type ProcessStep = { title: string; body: string }

export type HomePage = {
  hero: { image: Media; headline: string; headlineAccent: string; subhead: string }
  meet: { portrait: Media; secondary: Media; heading: string; body: string[] }
  stats: { value: number; suffix: string; label: string }[]
  signature: { images: [Media, Media]; eyebrow: string; heading: string; body: string[] }
  journeys: { heading: string; intro: string; items: { title: string; line: string; href: string; image: Media }[] }
  amenities: string[]
  planningFeeLine: string
  process: { heading: string; intro: string; steps: ProcessStep[] }
  destinations: { heading: string; intro: string }
  instagram: { heading: string; images: Media[] }
  closing: { heading: string; body: string; image: Media }
}

export type AboutPage = {
  portrait: Media
  headline: string
  intro: string
  story: string[]
  family: { heading: string; body: string[]; image: Media; image2?: Media }
  philosophy: { title: string; body: string }[]
  gallery: Media[]
}

export type ServicesPage = {
  intro: string
  styles: string
  planningFee: string
  processIntro: string
}

export type SeoMeta = { title?: string; description?: string; image?: Media }

export type ContactPage = { intro: string; panelHeading: string; panelBody: string }

export type InquiryPage = {
  intro: string
  budgetRanges: string[]
  thankYou: { heading: string; body: string; nextSteps: ProcessStep[] }
}
