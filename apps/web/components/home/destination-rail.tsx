"use client"

import { ArrowRight } from "@phosphor-icons/react"
import Link from "next/link"
import { useRef, ViewTransition } from "react"

import { Photo } from "@/components/editorial/photo"
import { gsap, prefersReducedMotion, useGSAP } from "@/components/motion/gsap"
import { Reveal } from "@/components/motion/reveal"
import type { Destination } from "@/content/types"
import { destinationPhotoName } from "@/lib/transitions"

/**
 * Featured destinations. On large screens the section pins and vertical scroll
 * pans the row sideways; on smaller screens it is a native swipe row with snap points.
 */
export function DestinationRail({
  heading,
  intro,
  destinations,
}: {
  heading: string
  intro: string
  destinations: Destination[]
}) {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const mm = gsap.matchMedia()
      mm.add("(min-width: 1024px)", () => {
        const el = track.current!
        const distance = () => el.scrollWidth - el.clientWidth
        gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        })
        gsap.utils.toArray<HTMLElement>("[data-card-media]").forEach((media) => {
          gsap.fromTo(
            media,
            { xPercent: -6 },
            {
              xPercent: 6,
              ease: "none",
              scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${distance()}`, scrub: true },
            }
          )
        })
      })
      return () => mm.revert()
    },
    { scope: root }
  )

  return (
    <section ref={root} aria-labelledby="rail-heading" className="overflow-hidden bg-background py-[4.5rem] lg:flex lg:min-h-[100svh] lg:flex-col lg:justify-center lg:py-16">
      <div className="container-editorial flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <Reveal as="h2" variant="lines" id="rail-heading" className="display-2">
            {heading}
          </Reveal>
          <p className="lede mt-5 max-w-[46ch]">{intro}</p>
        </div>
        <Link
          href="/destinations"
          className="group inline-flex shrink-0 items-center gap-3 text-[0.8rem] font-medium tracking-[0.18em] uppercase"
        >
          <span className="link-draw">All destinations</span>
          <ArrowRight weight="light" aria-hidden className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
        </Link>
      </div>

      <div
        ref={track}
        className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-5 px-5 pb-4 [scrollbar-width:none] md:gap-8 md:scroll-px-10 md:px-10 lg:mt-14 lg:snap-none lg:overflow-visible lg:motion-reduce:overflow-x-auto lg:pr-[12vw] lg:pl-[max(2.5rem,calc((100vw-1240px)/2+2.5rem))] [&::-webkit-scrollbar]:hidden"
      >
        {destinations.map((d) => (
          <article key={d.slug} className="w-[78vw] max-w-[26rem] shrink-0 snap-start sm:w-[20rem] lg:w-[24rem] xl:w-[27rem]">
            <Link href={`/destinations/${d.slug}`} className="group block">
              <ViewTransition name={destinationPhotoName(d.slug)} share="morph" enter="page-in" exit="page-out" default="none">
                <div className="frame-zoom relative aspect-[4/5] overflow-hidden">
                  <div data-card-media className="absolute -inset-x-[8%] inset-y-0">
                    <Photo media={d.cover} sizes="(min-width: 1024px) 30vw, 78vw" className="absolute inset-0" />
                  </div>
                  <span className="absolute top-4 left-4 bg-background/90 px-2.5 py-1 text-[0.7rem] font-medium tracking-[0.18em] text-foreground uppercase">
                    {d.region}
                  </span>
                </div>
              </ViewTransition>
              <div className="mt-5 flex items-start justify-between gap-4">
                <div>
                  <h3 className="display-3">{d.title}</h3>
                  <p className="mt-1.5 text-[0.95rem] text-ink-soft">{d.teaser}</p>
                </div>
                <ArrowRight
                  weight="light"
                  aria-hidden
                  className="mt-2 size-5 shrink-0 -translate-x-2 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100"
                />
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}
