import type { Metadata } from "next"

import { Amenities } from "@/components/home/amenities"
import { ClosingCta } from "@/components/home/closing-cta"
import { Credentials } from "@/components/home/credentials"
import { DestinationRail } from "@/components/home/destination-rail"
import { Hero } from "@/components/home/hero"
import { InstagramRow } from "@/components/home/instagram-row"
import { Journeys } from "@/components/home/journeys"
import { Meet } from "@/components/home/meet"
import { Process } from "@/components/home/process"
import { Signature } from "@/components/home/signature"
import { TestimonialCarousel } from "@/components/home/testimonial-carousel"
import { getFeaturedDestinations, getHomePage, getSiteSettings, getTestimonials } from "@/lib/content"

export async function generateMetadata(): Promise<Metadata> {
  const home = await getHomePage()
  return {
    title: home.seo.title ? { absolute: home.seo.title } : undefined,
    description: home.seo.description,
    openGraph: home.seo.image ? { images: [{ url: home.seo.image.src, alt: home.seo.image.alt }] } : undefined,
  }
}

export default async function HomePage() {
  const [home, site, featured, testimonials] = await Promise.all([
    getHomePage(),
    getSiteSettings(),
    getFeaturedDestinations(),
    getTestimonials({ featuredOnly: true }),
  ])


  return (
    <>
      <Hero hero={home.hero} />
      <Meet meet={home.meet} stats={home.stats} />
      <Signature signature={home.signature} />
      <Journeys heading={home.journeys.heading} intro={home.journeys.intro} journeys={home.journeys.items} />
      <Amenities amenities={home.amenities} planningFeeLine={home.planningFeeLine} />
      <Process heading={home.process.heading} intro={home.process.intro} steps={home.process.steps} />
      <DestinationRail heading={home.destinations.heading} intro={home.destinations.intro} destinations={featured} />
      <TestimonialCarousel testimonials={testimonials} />
      <Credentials credentials={site.credentials} />
      <InstagramRow
        heading={home.instagram.heading}
        images={home.instagram.images}
        instagram={site.social.find((s) => s.network === "instagram")}
      />
      <ClosingCta heading={home.closing.heading} body={home.closing.body} image={home.closing.image} location="home-closing" />
    </>
  )
}
