import { ViewTransition } from "react"

import { Photo } from "@/components/editorial/photo"
import type { Destination } from "@/content/types"
import { destinationPhotoName } from "@/lib/transitions"

export function DestinationHero({ destination: d }: { destination: Destination }) {
  return (
    <section data-hero-overlay className="relative isolate flex min-h-[86svh] items-end overflow-hidden bg-espresso text-ivory">
      {/* The cover photo grows out of the card that was tapped (see lib/transitions.ts). */}
      <ViewTransition name={destinationPhotoName(d.slug)} share="morph" enter="page-in" exit="page-out" default="none">
        <div className="absolute inset-0 -z-10">
          <Photo media={d.cover} priority sizes="100vw" className="hero-settle absolute inset-0 bg-espresso" />
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(to_top,rgb(30_26_23/0.8)_0%,rgb(30_26_23/0.3)_45%,rgb(30_26_23/0.1)_75%)]"
          />
        </div>
      </ViewTransition>
      <div className="container-editorial pt-40 pb-12 lg:pb-16">
        <p className="eyebrow rise-in text-ivory/85!">{d.region}</p>
        <h1 className="mt-4 font-heading text-[clamp(3.25rem,2rem+6vw,7rem)] leading-[0.95] font-medium tracking-[-0.02em]">
          <span className="mask-line">
            <span style={{ animationDelay: "200ms" }}>{d.title}</span>
          </span>
        </h1>
        <div className="rise-in mt-8 flex flex-col gap-4 border-t border-ivory/25 pt-5 text-[0.85rem] text-ivory/85 sm:flex-row sm:items-center sm:justify-between [animation-delay:500ms]">
          <p className="font-heading text-[1.25rem] text-ivory italic">{d.teaser}</p>
          <p>{d.cover.caption}</p>
        </div>
      </div>
    </section>
  )
}
