import { Amenities } from "@/components/home/amenities"
import { ClosingCta } from "@/components/home/closing-cta"
import { Credentials } from "@/components/home/credentials"
import { DestinationRail } from "@/components/home/destination-rail"
import { Hero } from "@/components/home/hero"
import { InstagramRow } from "@/components/home/instagram-row"
import { Journeys, type Journey } from "@/components/home/journeys"
import { Meet } from "@/components/home/meet"
import { Process } from "@/components/home/process"
import { Signature } from "@/components/home/signature"
import { TestimonialCarousel } from "@/components/home/testimonial-carousel"
import { photo } from "@/content/media"
import { getFeaturedDestinations, getHomePage, getSiteSettings, getTestimonials } from "@/lib/content"

export default async function HomePage() {
  const [home, site, featured, testimonials] = await Promise.all([
    getHomePage(),
    getSiteSettings(),
    getFeaturedDestinations(),
    getTestimonials({ featuredOnly: true }),
  ])

  // The six journey styles from the brief, each linking to its section on /services.
  const journeys: Journey[] = [
    { title: "Families", line: "Luxury family travel, my signature: beautiful stays and itineraries for every age.", href: "/services#family", image: photo("resort-pool-daughter") },
    { title: "Honeymoons", line: "The first trip of your married life, curated down to the sunset table.", href: "/services#honeymoons", image: photo("stock-santorini-oia") },
    { title: "Romantic getaways", line: "Anniversaries and escapes for two, wherever feels most like you.", href: "/services#honeymoons", image: photo("stock-santorini-steps") },
    { title: "Destination weddings", line: "Extraordinary places to say “I do,” with travel arranged for every guest.", href: "/services#weddings", image: photo("stock-caribbean-beach") },
    { title: "Group trips", line: "Reunions, milestone celebrations and generations traveling together.", href: "/services#groups", image: photo("milan-duomo-family") },
    { title: "Once-in-a-lifetime adventures", line: "Safaris, Egypt, Machu Picchu and the journeys you’ve dreamed about for years.", href: "/services#adventures", image: photo("stock-machu-picchu") },
  ]

  return (
    <>
      <Hero hero={home.hero} />
      <Meet meet={home.meet} stats={home.stats} />
      <Signature signature={home.signature} />
      <Journeys heading={home.journeys.heading} intro={home.journeys.intro} journeys={journeys} />
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
