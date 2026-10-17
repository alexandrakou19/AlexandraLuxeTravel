import { ArrowRight } from "@phosphor-icons/react/ssr"
import Link from "next/link"

import { Photo } from "@/components/editorial/photo"
import type { Destination } from "@/content/types"
import { cn } from "@workspace/ui/lib/utils"

export function DestinationCard({
  destination: d,
  aspect = "aspect-[4/5]",
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  headingLevel: H = "h2",
}: {
  destination: Destination
  aspect?: string
  sizes?: string
  headingLevel?: "h2" | "h3"
}) {
  return (
    <Link href={`/destinations/${d.slug}`} className="group block">
      <div className={cn("frame-zoom relative overflow-hidden", aspect)}>
        <Photo media={d.cover} sizes={sizes} className="absolute inset-0" />
        <div aria-hidden className="absolute inset-0 bg-espresso/0 transition-colors duration-700 group-hover:bg-espresso/10" />
      </div>
      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">{d.region}</p>
          <H className="display-3 mt-2">{d.title}</H>
          <p className="mt-2 text-[0.95rem] text-ink-soft">{d.teaser}</p>
        </div>
        <ArrowRight
          weight="light"
          aria-hidden
          className="mt-8 size-5 shrink-0 -translate-x-2 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100"
        />
      </div>
    </Link>
  )
}
