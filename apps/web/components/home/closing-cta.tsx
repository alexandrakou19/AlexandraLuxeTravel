import { Photo } from "@/components/editorial/photo"
import { Reveal } from "@/components/motion/reveal"
import { InquireLink } from "@/components/site/inquire-link"
import type { Media } from "@/content/types"

export function ClosingCta({ heading, body, image, location }: { heading: string; body: string; image: Media; location: string }) {
  return (
    <section aria-labelledby="closing-heading" className="bg-surface">
      <div className="grid lg:grid-cols-2">
        <Reveal variant="image" className="order-last lg:order-first">
          <Photo media={image} sizes="(min-width: 1024px) 50vw, 100vw" className="aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[36rem]" />
        </Reveal>
        <div className="flex items-center px-5 py-20 md:px-10 lg:px-[min(8vw,7rem)] lg:py-28">
          <div>
            <Reveal as="h2" variant="lines" id="closing-heading" className="display-1 max-w-[12ch]">
              {heading}
            </Reveal>
            <Reveal delay={0.15}>
              <p className="lede mt-6 max-w-[38ch]">{body}</p>
              <div className="mt-10">
                <InquireLink location={location} size="lg">
                  Start planning
                </InquireLink>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
