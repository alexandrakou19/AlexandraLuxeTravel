import { ArrowRight } from "@phosphor-icons/react/ssr"
import Link from "next/link"

import { Caption, Photo } from "@/components/editorial/photo"
import { CountUp } from "@/components/motion/count-up"
import { Reveal } from "@/components/motion/reveal"
import type { HomePage } from "@/content/types"

export function Meet({ meet, stats }: { meet: HomePage["meet"]; stats: HomePage["stats"] }) {
  return (
    <section aria-labelledby="meet-heading" className="section-pad overflow-x-clip">
      <div className="container-editorial grid items-center gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="relative lg:col-span-6 lg:col-start-1">
          <figure className="relative">
            <Reveal variant="image">
              <Photo media={meet.portrait} sizes="(min-width: 1024px) 46vw, 100vw" className="aspect-[4/5]" />
            </Reveal>
            <Caption media={meet.portrait} />
          </figure>
        </div>

        <div className="lg:col-span-5 lg:col-start-8">
          <p className="eyebrow">Meet Alexandra</p>
          <Reveal as="h2" variant="lines" id="meet-heading" className="display-2 mt-5">
            {meet.heading}
          </Reveal>
          <Reveal variant="stagger" className="mt-8 space-y-5 text-ink-soft">
            {meet.body.map((p) => (
              <p key={p.slice(0, 24)} data-reveal-item className="max-w-[52ch]">
                {p}
              </p>
            ))}
            <p data-reveal-item>
              <Link href="/about" className="group mt-3 inline-flex items-center gap-3 text-[0.8rem] font-medium tracking-[0.18em] text-foreground uppercase">
                <span className="link-draw">Read my story</span>
                <ArrowRight weight="light" aria-hidden className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
              </Link>
            </p>
          </Reveal>

          <Reveal as="dl" variant="stagger" className="mt-14 grid grid-cols-3 border-t border-hairline">
            {stats.map((s) => (
              <div key={s.label} data-reveal-item className="border-r border-hairline pt-6 pr-3 last:border-r-0 [&:not(:first-child)]:pl-4 md:[&:not(:first-child)]:pl-6">
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-heading text-[clamp(2.25rem,1.8rem+1.6vw,3.25rem)] leading-none">
                  <CountUp value={s.value} suffix={s.suffix} />
                </dd>
                <dd aria-hidden className="mt-3 text-[0.8rem] leading-snug text-ink-soft">
                  {s.label}
                </dd>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
