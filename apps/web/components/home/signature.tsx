import { Caption, Photo } from "@/components/editorial/photo"
import { Drift } from "@/components/motion/parallax"
import { Reveal } from "@/components/motion/reveal"
import { InquireLink } from "@/components/site/inquire-link"
import type { HomePage } from "@/content/types"

export function Signature({ signature }: { signature: HomePage["signature"] }) {
  const [main, second] = signature.images
  return (
    <section aria-labelledby="signature-heading" className="section-pad relative overflow-x-clip bg-surface">
      <div className="container-editorial grid gap-16 lg:grid-cols-12 lg:items-center lg:gap-10">
        <div className="lg:col-span-5">
          <p className="eyebrow">{signature.eyebrow}</p>
          <Reveal as="h2" variant="lines" id="signature-heading" className="display-2 mt-5 max-w-[17ch]">
            {signature.heading}
          </Reveal>
          <Reveal variant="stagger" className="mt-8 space-y-5">
            {signature.body.map((p) => (
              <p key={p.slice(0, 24)} data-reveal-item className="max-w-[50ch] text-ink-soft">
                {p}
              </p>
            ))}
            <div data-reveal-item className="flex flex-wrap items-center gap-6 pt-4">
              <InquireLink href="/inquire?trip=family" location="home-signature">
                Plan a family journey
              </InquireLink>
            </div>
          </Reveal>
        </div>

        <div className="relative grid grid-cols-12 lg:col-span-6 lg:col-start-7">
          <figure className="col-span-9 col-start-1 row-start-1">
            <Reveal variant="image">
              <Photo media={main} sizes="(min-width: 1024px) 36vw, 75vw" className="aspect-[4/5]" />
            </Reveal>
            <Caption media={main} />
          </figure>
          <Drift amount={18} className="col-span-5 col-start-8 row-start-1 mt-[38%] self-start">
            <figure>
              <Reveal variant="image" delay={0.2} className="border-[6px] border-surface md:border-8">
                <Photo media={second} sizes="(min-width: 1024px) 20vw, 42vw" className="aspect-[3/4]" />
              </Reveal>
              <Caption media={second} />
            </figure>
          </Drift>
        </div>
      </div>
    </section>
  )
}
