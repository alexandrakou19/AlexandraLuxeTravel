import { InstagramLogo } from "@phosphor-icons/react/ssr"

import { Photo } from "@/components/editorial/photo"
import { Reveal } from "@/components/motion/reveal"
import type { Media, SocialLink } from "@/content/types"

/** A curated row of her photos (managed in content, not a live feed). */
export function InstagramRow({ heading, images, instagram }: { heading: string; images: Media[]; instagram?: SocialLink }) {
  if (!images.length) return null
  return (
    <section aria-labelledby="instagram-heading" className="section-pad overflow-hidden">
      <div className="container-editorial flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <Reveal as="h2" variant="lines" id="instagram-heading" className="display-2">
          {heading}
        </Reveal>
        {instagram ? (
          <a
            href={instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 text-[0.95rem]"
          >
            <InstagramLogo weight="light" aria-hidden className="size-5" />
            <span className="link-draw">{instagram.handle ?? "Instagram"}</span>
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        ) : null}
      </div>
      <Reveal
        as="ul"
        variant="stagger"
        className="mt-12 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 [scrollbar-width:none] md:px-10 lg:grid lg:grid-cols-7 lg:overflow-visible lg:px-3 [&::-webkit-scrollbar]:hidden"
      >
        {images.map((img, i) => (
          <li key={img.id} data-reveal-item className={`w-[46vw] shrink-0 snap-start sm:w-[30vw] lg:w-auto ${i % 2 ? "lg:mt-10" : ""}`}>
            <a
              href={instagram?.url ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${img.alt} (Instagram, opens in a new tab)`}
              className="frame-zoom block"
            >
              <Photo media={img} sizes="(min-width: 1024px) 14vw, 46vw" className="aspect-[4/5]" quality={70} />
            </a>
          </li>
        ))}
      </Reveal>
    </section>
  )
}
