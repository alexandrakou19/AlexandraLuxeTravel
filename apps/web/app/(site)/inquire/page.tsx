import type { Metadata } from "next"

import { Caption, Photo } from "@/components/editorial/photo"
import { InquiryForm } from "@/components/forms/inquiry-form"
import { photo } from "@/content/media"
import { getDestinations, getInquiryPage, getSiteSettings } from "@/lib/content"

export const metadata: Metadata = {
  title: "Start Planning Your Trip",
  description:
    "Share your dates, dream destinations and budget, and Alexandra will prepare a first draft of your personalized itinerary.",
  alternates: { canonical: "/inquire" },
}

export default async function InquirePage() {
  const [page, site, destinations] = await Promise.all([getInquiryPage(), getSiteSettings(), getDestinations()])
  const destinationNames = Object.fromEntries(destinations.map((d) => [d.slug, d.title]))
  const image = photo("paris-family-seine")

  return (
    <section className="container-editorial pt-28 pb-24 lg:pt-36 lg:pb-32">
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow rise-in">Travel inquiry</p>
            <h1 className="display-1 rise-in mt-5 [animation-delay:80ms]">
              Let’s plan your <em className="italic">journey</em>
            </h1>
            <p className="lede rise-in mt-6 [animation-delay:180ms]">{page.intro}</p>
            <figure className="rise-in mt-10 hidden lg:block [animation-delay:260ms]">
              <Photo media={image} sizes="30vw" className="aspect-[4/5]" />
              <Caption media={image} />
            </figure>
            <p className="mt-8 text-[0.92rem] text-ink-soft">
              Prefer email?{" "}
              <a href={`mailto:${site.email}`} className="break-all text-foreground underline decoration-accent-line underline-offset-4">
                {site.email}
              </a>
            </p>
          </div>
        </aside>

        <div className="rise-in bg-surface px-5 py-9 sm:px-9 sm:py-12 lg:col-span-7 lg:col-start-6 lg:px-14 lg:py-14 [animation-delay:200ms]">
          <InquiryForm budgetRanges={page.budgetRanges} destinationNames={destinationNames} />
        </div>
      </div>
    </section>
  )
}
