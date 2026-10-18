/**
 * Seeds Payload with the launch content (the copy and photos from the client folder).
 * Safe to re-run: documents are matched by a stable key and updated in place.
 *
 *   bun run seed          (from apps/web)
 */
import path from "node:path"
import { fileURLToPath } from "node:url"

import config from "@payload-config"
import { getPayload, type Payload } from "payload"

import { destinations } from "../content/destinations"
import { brand, photo } from "../content/media"
import { brandFiles, photoFiles } from "../content/media.generated"
import { aboutPage, amenities, homePage, inquiryPage, planningFeeLine, processSteps, servicesPage } from "../content/pages"
import { services } from "../content/services"
import { siteSettings, testimonials } from "../content/site"
import type { Media as ContentMedia } from "../content/types"

const dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.resolve(dirname, "../public")
const context = { disableRevalidate: true }

/* ---------- helpers ---------- */

const paragraphs = (list: string[]) => list.join("\n\n")
const items = (list: string[]) => list.map((item) => ({ item }))

function focal(media: ContentMedia) {
  const m = media.focal?.match(/(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%/)
  return m ? { focalX: Number(m[1]), focalY: Number(m[2]) } : {}
}

const text = (value: string) => ({ type: "text", text: value, format: 0, style: "", mode: "normal", detail: 0, version: 1 })
const block = (type: "paragraph" | "heading", value: string) => ({
  type,
  ...(type === "heading" ? { tag: "h2" } : { textFormat: 0, textStyle: "" }),
  format: "",
  indent: 0,
  version: 1,
  direction: "ltr",
  children: [text(value)],
})
function lexical(sections: { title: string; body: string[] }[]) {
  return {
    root: {
      type: "root",
      format: "",
      indent: 0,
      version: 1,
      direction: "ltr",
      children: sections.flatMap((s) => [block("heading", s.title), ...s.body.map((p) => block("paragraph", p))]),
    },
  } as never
}

async function upsert(payload: Payload, collection: "services" | "destinations" | "testimonials", where: Record<string, unknown>, data: Record<string, unknown>) {
  const found = await payload.find({ collection, where: where as never, limit: 1, depth: 0, draft: true, context })
  const doc = found.docs[0]
  if (doc) return payload.update({ collection, id: doc.id, data: data as never, depth: 0, context })
  return payload.create({ collection, data: data as never, depth: 0, context })
}

/* ---------- media ---------- */

async function seedMedia(payload: Payload) {
  const ids = new Map<string, number | string>()
  const upload = async (key: string, filePath: string, data: Record<string, unknown>) => {
    const filename = path.basename(filePath)
    const existing = await payload.find({ collection: "media", where: { filename: { equals: filename } }, limit: 1, depth: 0 })
    const doc = existing.docs[0]
      ? await payload.update({ collection: "media", id: existing.docs[0].id, data: data as never, depth: 0, context })
      : await payload.create({ collection: "media", data: data as never, filePath, depth: 0, context })
    ids.set(key, doc.id)
  }

  for (const id of Object.keys(photoFiles) as (keyof typeof photoFiles)[]) {
    const m = photo(id)
    await upload(id, path.join(publicDir, photoFiles[id].src), {
      alt: m.alt,
      caption: m.caption,
      isStock: Boolean(m.isStock),
      credit: m.credit,
      ...focal(m),
    })
    payload.logger.info(`media: ${id}`)
  }
  for (const id of ["badge-sandals-elite", "badge-travelmation-luxury", "badge-travelmation-weddings", "badge-travelmation"] as const) {
    await upload(id, path.join(publicDir, brandFiles[id].src), { alt: brand(id).alt })
  }
  return ids
}

/* ---------- run ---------- */

async function run() {
  const payload = await getPayload({ config })
  const media = await seedMedia(payload)
  const img = (m: ContentMedia) => {
    const id = media.get(m.id)
    if (!id) throw new Error(`Missing media ${m.id}`)
    return id
  }

  // Services
  const serviceIds = new Map<string, number | string>()
  for (const s of services) {
    const doc = await upsert(payload, "services", { anchor: { equals: s.anchor } }, {
      title: s.title,
      shortTitle: s.shortTitle,
      anchor: s.anchor,
      order: s.order,
      summary: s.summary,
      body: paragraphs(s.body),
      included: items(s.included),
      idealFor: s.idealFor,
      image: img(s.image),
      tripType: s.tripType,
      _status: "published",
    })
    serviceIds.set(s.anchor, doc.id)
  }
  payload.logger.info(`services: ${services.length}`)

  // Destinations (two passes so "related" can point at each other)
  const destIds = new Map<string, number | string>()
  for (const d of destinations) {
    const doc = await upsert(payload, "destinations", { slug: { equals: d.slug } }, {
      title: d.title,
      slug: d.slug,
      region: d.region,
      featured: d.featured,
      tags: d.tags,
      cover: img(d.cover),
      teaser: d.teaser,
      intro: paragraphs(d.intro),
      places: d.places.map((name) => ({ name })),
      bestTime: d.bestTime,
      signatureExperiences: items(d.signatureExperiences),
      perfectFor: items(d.perfectFor),
      gallery: d.gallery.map(img),
      _status: "published",
    })
    destIds.set(d.slug, doc.id)
  }
  for (const d of destinations) {
    await payload.update({
      collection: "destinations",
      id: destIds.get(d.slug)!,
      data: { related: d.related.map((slug) => destIds.get(slug)!).filter(Boolean), _status: "published" } as never,
      depth: 0,
      context,
    })
  }
  payload.logger.info(`destinations: ${destinations.length}`)

  // Testimonials
  for (const t of testimonials) {
    await upsert(payload, "testimonials", { clientName: { equals: t.clientName } }, {
      quote: t.quote,
      clientName: t.clientName,
      trip: t.trip,
      tripType: t.tripType,
      featured: t.featured,
      order: t.order,
      _status: "published",
    })
  }
  payload.logger.info(`testimonials: ${testimonials.length}`)

  // Globals
  await payload.updateGlobal({
    slug: "site-settings",
    context,
    data: {
      tagline: siteSettings.tagline,
      email: siteSettings.email,
      social: siteSettings.social.map((s) => ({ network: s.network, handle: s.handle, url: s.url })),
      // REVIEW(Saad): confirm the notification inbox with the client.
      notificationEmail: siteSettings.email,
      replyTimePromise: siteSettings.replyTimePromise,
      credentials: siteSettings.credentials.map((c) => ({ name: c.name, logo: c.logo ? media.get(c.logo.id) : undefined })),
      testimonialsEnabled: siteSettings.testimonialsEnabled,
      defaultSeoImage: img(siteSettings.defaultSeoImage),
    } as never,
  })

  const journeyRows = [
    { title: "Families", line: "Luxury family travel, my signature: beautiful stays and itineraries for every age.", anchor: "family", image: "resort-pool-daughter" },
    { title: "Honeymoons", line: "The first trip of your married life, curated down to the sunset table.", anchor: "honeymoons", image: "stock-santorini-oia" },
    { title: "Romantic getaways", line: "Anniversaries and escapes for two, wherever feels most like you.", anchor: "honeymoons", image: "stock-santorini-steps" },
    { title: "Destination weddings", line: "Extraordinary places to say “I do,” with travel arranged for every guest.", anchor: "weddings", image: "stock-caribbean-beach" },
    { title: "Group trips", line: "Reunions, milestone celebrations and generations traveling together.", anchor: "groups", image: "milan-duomo-family" },
    { title: "Once-in-a-lifetime adventures", line: "Safaris, Egypt, Machu Picchu and the journeys you’ve dreamed about for years.", anchor: "adventures", image: "stock-machu-picchu" },
  ]

  await payload.updateGlobal({
    slug: "home-page",
    context,
    data: {
      heroImage: img(homePage.hero.image),
      heroHeadline: homePage.hero.headline,
      heroHeadlineAccent: homePage.hero.headlineAccent,
      heroSubhead: homePage.hero.subhead,
      meetHeading: homePage.meet.heading,
      meetBody: paragraphs(homePage.meet.body),
      meetPortrait: img(homePage.meet.portrait),
      meetSecondary: img(homePage.meet.secondary),
      stats: homePage.stats,
      signatureEyebrow: homePage.signature.eyebrow,
      signatureHeading: homePage.signature.heading,
      signatureBody: paragraphs(homePage.signature.body),
      signatureImage: img(homePage.signature.images[0]),
      signatureImage2: img(homePage.signature.images[1]),
      journeysHeading: homePage.journeys.heading,
      journeysIntro: homePage.journeys.intro,
      journeys: journeyRows.map((j) => ({ title: j.title, line: j.line, service: serviceIds.get(j.anchor), image: media.get(j.image) })),
      processHeading: homePage.process.heading,
      processIntro: homePage.process.intro,
      destinationsHeading: homePage.destinations.heading,
      destinationsIntro: homePage.destinations.intro,
      instagramHeading: homePage.instagram.heading,
      instagramImages: homePage.instagram.images.map(img),
      closingHeading: homePage.closing.heading,
      closingBody: homePage.closing.body,
      closingImage: img(homePage.closing.image),
      _status: "published",
    } as never,
  })

  await payload.updateGlobal({
    slug: "about-page",
    context,
    data: {
      portrait: img(aboutPage.portrait),
      headline: aboutPage.headline,
      intro: aboutPage.intro,
      story: paragraphs(aboutPage.story),
      family: {
        heading: aboutPage.family.heading,
        body: paragraphs(aboutPage.family.body),
        image: img(aboutPage.family.image),
        image2: media.get("resort-pool-daughter"),
      },
      philosophy: aboutPage.philosophy,
      gallery: aboutPage.gallery.map(img),
      _status: "published",
    } as never,
  })

  await payload.updateGlobal({
    slug: "services-page",
    context,
    data: {
      intro: servicesPage.intro,
      styles: servicesPage.styles,
      planningFee: planningFeeLine,
      amenities: items(amenities),
      processIntro: servicesPage.processIntro,
      processSteps,
      _status: "published",
    } as never,
  })

  await payload.updateGlobal({
    slug: "contact-page",
    context,
    data: {
      intro: "Questions, ideas, or just want to say hello? I’d love to hear from you.",
      panelHeading: "Planning a trip?",
      panelBody:
        "Use the travel inquiry form. It takes about three minutes and gives me everything I need to prepare a first draft for you.",
    },
  })

  await payload.updateGlobal({
    slug: "inquiry-page",
    context,
    data: {
      intro: inquiryPage.intro,
      budgetRanges: inquiryPage.budgetRanges.map((label) => ({ label })),
      thankYou: inquiryPage.thankYou,
    } as never,
  })

  // REVIEW(Saad): placeholder policy for client and legal review before launch.
  await payload.updateGlobal({
    slug: "privacy-policy",
    context,
    data: {
      intro: "Your trust matters. This page explains what information I collect through this website and how it is used.",
      lastUpdated: "October 2026",
      content: lexical([
        {
          title: "What I collect",
          body: [
            "When you send a travel inquiry or contact message, I collect the details you choose to share: your name, email, phone number, where you are based, and information about your trip such as dates, destinations, budget, preferences and the number and ages of travelers, including children.",
            "I only ask for children’s ages so I can recommend suitable accommodations, activities and travel arrangements.",
          ],
        },
        {
          title: "How I use it",
          body: [
            "Your information is used to respond to your inquiry, prepare travel proposals, make bookings you request and keep in touch about your trip. I do not sell your personal information.",
            "When you book, relevant details are shared with the suppliers needed to deliver your trip, such as hotels, cruise lines, tour operators and airlines.",
          ],
        },
        {
          title: "Services that help run this website",
          body: [
            "Inquiries are stored securely and delivered by email through a secure email provider. With your request, trip details may be added to my travel planning software. The website may use spam protection and analytics to understand how visitors use the site. These providers process data on my behalf only.",
          ],
        },
        {
          title: "How long I keep it",
          body: ["I keep inquiry and trip records only as long as needed to plan and support your travel and to meet legal and accounting obligations."],
        },
        {
          title: "Your choices",
          body: [`You can ask to see, correct or delete the personal information I hold about you at any time by emailing ${siteSettings.email}.`],
        },
      ]),
    } as never,
  })

  payload.logger.info("Seed complete.")
  process.exit(0)
}

// Top-level await: `payload run` exits once this module finishes evaluating.
try {
  await run()
} catch (err) {
  console.error(err)
  process.exit(1)
}
