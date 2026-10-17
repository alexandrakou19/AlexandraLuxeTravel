import type { Metadata } from "next"

import { Caption, Photo } from "@/components/editorial/photo"
import { ClosingCta } from "@/components/home/closing-cta"
import { Credentials } from "@/components/home/credentials"
import { Drift } from "@/components/motion/parallax"
import { Reveal } from "@/components/motion/reveal"
import { photo } from "@/content/media"
import { getAboutPage, getHomePage, getSiteSettings } from "@/lib/content"

export const metadata: Metadata = {
  title: "About Alexandra",
  description:
    "Meet Alexandra: wife, mother of three and founder of Alexandra Luxe Travel. 30+ countries, 40+ U.S. states and 400 destinations explored, and a belief that the best memories are made together.",
  alternates: { canonical: "/about" },
}

export default async function AboutPage() {
  const [about, home, site] = await Promise.all([getAboutPage(), getHomePage(), getSiteSettings()])

  return (
    <>
      {/* Portrait hero */}
      <section className="container-editorial pt-28 pb-16 lg:pt-36 lg:pb-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-6 lg:pb-10">
            <p className="eyebrow rise-in">About me</p>
            <h1 className="display-1 rise-in mt-5 [animation-delay:80ms]">{about.headline}</h1>
            <p className="lede rise-in mt-8 max-w-[48ch] [animation-delay:200ms]">{about.intro}</p>
          </div>
          <figure className="rise-in lg:col-span-5 lg:col-start-8 [animation-delay:120ms]">
            <Photo
              media={about.portrait}
              priority
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="hero-settle aspect-[4/5]"
            />
            <Caption media={about.portrait} />
          </figure>
        </div>

        <dl className="mt-16 grid grid-cols-3 border-t border-hairline lg:mt-24">
          {home.stats.map((s) => (
            <div key={s.label} className="border-r border-hairline pt-6 pr-3 last:border-r-0 [&:not(:first-child)]:pl-4 md:[&:not(:first-child)]:pl-8">
              <dt className="sr-only">{s.label}</dt>
              <dd className="font-heading text-[clamp(2.25rem,1.6rem+2.4vw,4rem)] leading-none tabular-nums">
                {s.value}
                {s.suffix}
              </dd>
              <dd aria-hidden className="mt-3 text-[0.85rem] text-ink-soft">
                {s.label}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Her story */}
      <section aria-labelledby="story-heading" className="section-pad bg-surface">
        <div className="container-editorial grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <Reveal as="h2" variant="lines" id="story-heading" className="display-2 lg:sticky lg:top-32">
              My story
            </Reveal>
          </div>
          <Reveal variant="stagger" className="space-y-7 lg:col-span-7 lg:col-start-6">
            {about.story.map((p, i) => (
              <p
                key={p.slice(0, 20)}
                data-reveal-item
                className={
                  i === 0
                    ? "font-heading text-[clamp(1.4rem,1.15rem+0.9vw,1.9rem)] leading-[1.4]"
                    : "max-w-[60ch] text-ink-soft"
                }
              >
                {p}
              </p>
            ))}
          </Reveal>
        </div>
      </section>

      {/* The family angle */}
      <section aria-labelledby="family-heading" className="section-pad overflow-x-clip">
        <div className="container-editorial grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-10">
          <figure className="relative lg:col-span-6">
            <Reveal variant="image">
              <Photo media={about.family.image} sizes="(min-width: 1024px) 46vw, 100vw" className="aspect-[4/5]" />
            </Reveal>
            <Caption media={about.family.image} />
            <Drift amount={16} className="absolute -right-2 bottom-16 hidden w-[38%] md:block lg:-right-12">
              <Reveal variant="image" delay={0.2} className="border-8 border-background">
                <Photo media={photo("resort-pool-daughter")} sizes="20vw" className="aspect-[3/4]" />
              </Reveal>
            </Drift>
          </figure>
          <div className="lg:col-span-5 lg:col-start-8">
            <Reveal as="h2" variant="lines" id="family-heading" className="display-2">
              {about.family.heading}
            </Reveal>
            <Reveal variant="stagger" className="mt-7 space-y-5">
              {about.family.body.map((p) => (
                <p key={p.slice(0, 20)} data-reveal-item className="max-w-[52ch] text-ink-soft">
                  {p}
                </p>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section aria-labelledby="philosophy-heading" className="bg-band py-20 text-band-foreground lg:py-28">
        <div className="container-editorial">
          <Reveal as="h2" variant="lines" id="philosophy-heading" className="display-2 max-w-[18ch]">
            What working with me is like
          </Reveal>
          <Reveal as="ol" variant="stagger" className="mt-14 grid gap-12 md:grid-cols-[1.2fr_1fr_1fr] md:gap-10 lg:mt-20">
            {about.philosophy.map((item) => (
              <li key={item.title} data-reveal-item className="border-t border-band-foreground/20 pt-7">
                <h3 className="display-3">{item.title}</h3>
                <p className="mt-4 max-w-[38ch] text-band-soft">{item.body}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <Credentials credentials={site.credentials} className="py-16 lg:py-20" />

      {/* Gallery */}
      <section aria-labelledby="gallery-heading" className="section-pad pt-8 lg:pt-10">
        <div className="container-editorial">
          <Reveal as="h2" variant="lines" id="gallery-heading" className="display-2">
            From my travels
          </Reveal>
          <ul className="mt-12 columns-2 gap-3 md:columns-3 md:gap-5 [&>li]:mb-3 md:[&>li]:mb-5">
            {about.gallery.map((img, i) => (
              <li key={img.id} className="break-inside-avoid">
                <figure>
                  <Reveal variant="image" delay={(i % 3) * 0.08}>
                    <Photo
                      media={img}
                      sizes="(min-width: 768px) 30vw, 48vw"
                      quality={70}
                      className={i % 3 === 1 ? "aspect-[3/4]" : i % 3 === 2 ? "aspect-[4/5]" : "aspect-[2/3]"}
                    />
                  </Reveal>
                  <Caption media={img} className="text-[0.75rem]" />
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ClosingCta
        heading="Let’s plan your journey"
        body="Tell me about the trip you’re dreaming of. I’d love to help you make it happen."
        image={photo("paris-family-eiffel")}
        location="about-closing"
      />
    </>
  )
}
