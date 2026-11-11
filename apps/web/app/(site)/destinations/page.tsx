import type { Metadata } from "next"

import { DestinationExplorer } from "@/components/destinations/destination-explorer"
import { PageHero } from "@/components/editorial/page-hero"
import { ClosingCta } from "@/components/home/closing-cta"
import { experienceFilters } from "@/content/destinations"
import { photo } from "@/content/media"
import { getDestinations } from "@/lib/content"

export const metadata: Metadata = {
  title: "Destination Inspiration",
  description:
    "Egypt, Greece, Italy, Thailand, Taiwan, Central Europe, Peru, the Caribbean and luxury family resorts in the USA. Explore destinations by family, romance, adventure, culture, beach and group travel.",
  alternates: { canonical: "/destinations" },
}

export default async function DestinationsPage() {
  const destinations = await getDestinations()
  return (
    <>
      <PageHero
        eyebrow="Destination inspiration"
        title={
          <>
            Places worth the <em className="italic">journey</em>
          </>
        }
      >
        <p>
          A little inspiration for your next journey. Every itinerary is designed around you.
        </p>
      </PageHero>
      <DestinationExplorer destinations={destinations} filters={experienceFilters} />
      <ClosingCta
        heading="Somewhere else in mind?"
        body="If it isn’t listed here, ask me. I plan journeys all over the world."
        image={photo("taipei-101")}
        location="destinations-closing"
      />
    </>
  )
}
