import { Check } from "@phosphor-icons/react/ssr"
import type { Metadata } from "next"
import Link from "next/link"

import { PageHero } from "@/components/editorial/page-hero"
import { Caption, Photo } from "@/components/editorial/photo"
import { Amenities } from "@/components/home/amenities"
import { ClosingCta } from "@/components/home/closing-cta"
import { Process } from "@/components/home/process"
import { Drift } from "@/components/motion/parallax"
import { Reveal } from "@/components/motion/reveal"
import { InquireLink } from "@/components/site/inquire-link"
import { amenities, processSteps } from "@/content/pages"
import { photo } from "@/content/media"
import { getServices, getServicesPage } from "@/lib/content"
import { cn } from "@workspace/ui/lib/utils"

export const metadata: Metadata = {
  title: "Travel Planning Services",
  description:
    "Luxury family travel, bespoke international journeys, bucket-list adventures, honeymoons, destination weddings and group travel, personally planned by Alexandra with no additional planning fee.",
  alternates: { canonical: "/services" },
}

export default async function ServicesPage() {
  const [page, services] = await Promise.all([getServicesPage(), getServices()])

  return (
    <>
      <PageHero
        eyebrow="Travel planning services"
        title={
          <>
            Every journey, <em className="italic">personally</em> planned
          </>
        }
      >
        <p>{page.intro}</p>
        <p className="mt-5 text-[0.95rem]">{page.styles}</p>
      </PageHero>

      <nav aria-label="Services" className="container-editorial">
        <ul className="flex flex-wrap gap-x-7 gap-y-3 border-y border-hairline py-5 text-[0.8rem] font-medium tracking-[0.14em] uppercase">
          {services.map((s) => (
            <li key={s.id}>
              <a href={`#${s.anchor}`} className="link-draw text-ink-soft hover:text-foreground">
                {s.shortTitle}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="pt-6 lg:pt-10">
        {services.map((s, i) => {
          const flip = i % 2 === 1
          return (
            <section
              key={s.id}
              id={s.anchor}
              aria-labelledby={`${s.anchor}-title`}
              className="section-pad scroll-mt-20"
            >
              <div className="container-editorial grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-10">
                <figure className={cn("lg:col-span-6", flip ? "lg:order-last lg:col-start-7" : "lg:col-start-1")}>
                  <Drift amount={6}>
                    <Reveal variant="image">
                      <Photo media={s.image} sizes="(min-width: 1024px) 46vw, 100vw" className={i === 0 ? "aspect-[4/5]" : "aspect-[5/6]"} />
                    </Reveal>
                  </Drift>
                  <Caption media={s.image} />
                </figure>

                <div className={cn("lg:col-span-5", flip ? "lg:col-start-1 lg:row-start-1" : "lg:col-start-8")}>
                  {i === 0 ? <p className="eyebrow">The signature</p> : null}
                  <Reveal as="h2" variant="lines" id={`${s.anchor}-title`} className={cn("display-2", i === 0 && "mt-5")}>
                    {s.title}
                  </Reveal>
                  <Reveal variant="stagger" className="mt-7 space-y-4">
                    {s.body.map((p) => (
                      <p key={p.slice(0, 20)} data-reveal-item className="max-w-[52ch] text-ink-soft">
                        {p}
                      </p>
                    ))}
                  </Reveal>
                  <Reveal className="mt-9">
                    <h3 className="eyebrow">What’s included</h3>
                    <ul className="mt-4 space-y-3">
                      {s.included.map((item) => (
                        <li key={item} className="flex gap-3">
                          <Check weight="light" aria-hidden className="mt-1.5 size-4 shrink-0 text-ink-soft" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-8 border-l border-accent-line pl-5 font-heading text-[1.25rem] leading-snug italic">
                      <span className="sr-only">Ideal for: </span>
                      {s.idealFor}
                    </p>
                    <div className="mt-9">
                      <InquireLink href={`/inquire?trip=${s.tripType}`} location={`services-${s.anchor}`}>
                        Inquire about this trip
                      </InquireLink>
                    </div>
                  </Reveal>
                </div>
              </div>
            </section>
          )
        })}
      </div>

      <Amenities amenities={amenities} planningFeeLine={page.planningFee} />
      <Process heading="How planning with me works" intro={page.processIntro} steps={processSteps} />

      <section className="container-editorial pb-20">
        <p className="text-ink-soft">
          Looking for inspiration first?{" "}
          <Link href="/destinations" className="text-foreground underline decoration-accent-line underline-offset-4">
            Explore destinations
          </Link>
          .
        </p>
      </section>

      <ClosingCta
        heading="Let’s plan something extraordinary"
        body="Share your dates, dream destinations and budget, and I’ll prepare a first draft that already feels like yours."
        image={photo("canyon-family-hike")}
        location="services-closing"
      />
    </>
  )
}
