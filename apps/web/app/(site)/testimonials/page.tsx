import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { PageHero } from "@/components/editorial/page-hero"
import { ClosingCta } from "@/components/home/closing-cta"
import { Reveal } from "@/components/motion/reveal"
import { photo } from "@/content/media"
import { getTestimonials } from "@/lib/content"
import { cn } from "@workspace/ui/lib/utils"

export const metadata: Metadata = {
  title: "Testimonials",
  description: "What travelers say about planning with Alexandra Luxe Travel.",
  alternates: { canonical: "/testimonials" },
}

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials()
  // Toggled off in Site Settings (or none yet): the page stays out of reach.
  if (!testimonials.length) notFound()

  const [lead, ...rest] = testimonials

  return (
    <>
      <PageHero
        eyebrow="Testimonials"
        title={
          <>
            Kind words from <em className="italic">fellow travelers</em>
          </>
        }
      />

      <section className="container-editorial pb-24 lg:pb-32">
        {lead ? (
          <Reveal as="figure" className="border-t border-hairline pt-12 lg:grid lg:grid-cols-12 lg:gap-10 lg:pt-16">
            <svg aria-hidden viewBox="0 0 64 48" className="h-10 w-14 text-accent-line lg:col-span-2">
              <path
                fill="currentColor"
                d="M0 48V28.8C0 12.6 8.4 2.9 25.2 0l2.4 5.6C19 8 14.6 13.1 14.2 21H26v27H0Zm36 0V28.8C36 12.6 44.4 2.9 61.2 0l2.4 5.6C55 8 50.6 13.1 50.2 21H62v27H36Z"
              />
            </svg>
            <div className="mt-8 lg:col-span-9 lg:col-start-4 lg:mt-0">
              <blockquote className="font-heading text-[clamp(1.6rem,1.2rem+1.6vw,2.6rem)] leading-[1.3]">“{lead.quote}”</blockquote>
              <figcaption className="mt-8 flex flex-wrap items-baseline gap-x-4">
                <span className="text-[0.8rem] font-medium tracking-[0.18em] uppercase">{lead.clientName}</span>
                <span className="text-ink-soft italic">{lead.trip}</span>
              </figcaption>
            </div>
          </Reveal>
        ) : null}

        <Reveal as="ul" variant="stagger" className="mt-20 grid gap-12 md:grid-cols-2 md:gap-x-16 lg:mt-28">
          {rest.map((t, i) => (
            <li key={t.id} data-reveal-item className={cn("border-t border-hairline pt-10", i % 2 === 1 && "md:mt-24")}>
              <figure>
                <blockquote className="font-heading text-[clamp(1.3rem,1.1rem+0.7vw,1.65rem)] leading-[1.45]">“{t.quote}”</blockquote>
                <figcaption className="mt-7 flex flex-wrap items-baseline gap-x-4">
                  <span className="text-[0.8rem] font-medium tracking-[0.18em] uppercase">{t.clientName}</span>
                  <span className="text-ink-soft italic">{t.trip}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </Reveal>
      </section>

      <ClosingCta
        heading="Your story could be next"
        body="Tell me about the trip you’re dreaming of, and let’s make it one you’ll talk about for years."
        image={photo("milan-duomo-family")}
        location="testimonials-closing"
      />
    </>
  )
}
