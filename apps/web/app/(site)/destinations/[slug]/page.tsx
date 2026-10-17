import { ArrowLeft } from "@phosphor-icons/react/ssr"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { DestinationCard } from "@/components/destinations/destination-card"
import { DestinationHero } from "@/components/destinations/destination-hero"
import { Caption, Photo } from "@/components/editorial/photo"
import { Reveal } from "@/components/motion/reveal"
import { InquireLink } from "@/components/site/inquire-link"
import { JsonLd } from "@/components/site/json-ld"
import { getDestination, getDestinations, getRelatedDestinations } from "@/lib/content"
import { absoluteUrl } from "@/lib/utils"

export async function generateStaticParams() {
  const destinations = await getDestinations()
  return destinations.map((d) => ({ slug: d.slug }))
}

export const dynamicParams = false

export async function generateMetadata(props: PageProps<"/destinations/[slug]">): Promise<Metadata> {
  const { slug } = await props.params
  const d = await getDestination(slug)
  if (!d) return {}
  return {
    title: d.seo?.title ?? `${d.title} Travel`,
    description: d.seo?.description ?? `${d.teaser} ${d.intro[0]}`.slice(0, 158),
    alternates: { canonical: `/destinations/${d.slug}` },
    openGraph: { images: [{ url: d.cover.src, width: d.cover.width, height: d.cover.height, alt: d.cover.alt }] },
  }
}

export default async function DestinationPage(props: PageProps<"/destinations/[slug]">) {
  const { slug } = await props.params
  const d = await getDestination(slug)
  if (!d) notFound()
  const related = await getRelatedDestinations(d)
  const planHref = `/inquire?destination=${d.slug}`

  return (
    <>
      <DestinationHero destination={d} />

      {/* Intro + at a glance */}
      <section className="section-pad">
        <div className="container-editorial grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <Link
              href="/destinations"
              className="group inline-flex items-center gap-2 text-[0.8rem] font-medium tracking-[0.16em] text-ink-soft uppercase"
            >
              <ArrowLeft weight="light" aria-hidden className="size-4 transition-transform duration-500 group-hover:-translate-x-1" />
              <span className="link-draw">All destinations</span>
            </Link>
            <Reveal variant="stagger" className="mt-10 space-y-6">
              {d.intro.map((p, i) => (
                <p
                  key={p.slice(0, 20)}
                  data-reveal-item
                  className={i === 0 ? "font-heading text-[clamp(1.4rem,1.15rem+0.9vw,1.9rem)] leading-[1.4]" : "max-w-[60ch] text-ink-soft"}
                >
                  {p}
                </p>
              ))}
            </Reveal>
          </div>

          <Reveal as="aside" aria-label="At a glance" className="lg:col-span-4 lg:col-start-9">
            <dl className="divide-y divide-hairline border-y border-hairline">
              <div className="py-6">
                <dt className="eyebrow">Best time to go</dt>
                <dd className="mt-3">{d.bestTime}</dd>
              </div>
              <div className="py-6">
                <dt className="eyebrow">Where</dt>
                <dd className="mt-3">{d.places.join(" · ")}</dd>
              </div>
              <div className="py-6">
                <dt className="eyebrow">Perfect for</dt>
                <dd className="mt-4 flex flex-wrap gap-2">
                  {d.perfectFor.map((p) => (
                    <span key={p} className="rounded-full border border-hairline px-3.5 py-1.5 text-[0.85rem]">
                      {p}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
            <div className="mt-8">
              <InquireLink href={planHref} location={`destination-${d.slug}-aside`}>
                Plan a trip to {d.title}
              </InquireLink>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Signature experiences */}
      <section aria-labelledby="experiences-heading" className="section-pad bg-surface">
        <div className="container-editorial grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <Reveal as="h2" variant="lines" id="experiences-heading" className="display-2 lg:sticky lg:top-32">
              Signature experiences
            </Reveal>
          </div>
          <Reveal as="ul" variant="stagger" className="border-t border-foreground/15 lg:col-span-7 lg:col-start-6">
            {d.signatureExperiences.map((e) => (
              <li key={e} data-reveal-item className="flex items-baseline gap-6 border-b border-foreground/15 py-6">
                <span aria-hidden className="h-px w-8 shrink-0 translate-y-[-0.35em] bg-accent-line" />
                <span className="font-heading text-[clamp(1.3rem,1.1rem+0.8vw,1.75rem)] leading-snug">{e}</span>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Gallery */}
      {d.gallery.length > 1 ? (
        <section aria-label={`${d.title} gallery`} className="section-pad">
          <div className="container-editorial grid gap-5 md:grid-cols-12">
            {d.gallery.map((img, i) => (
              <figure key={img.id} className={i % 2 === 0 ? "md:col-span-7" : "md:col-span-5 md:mt-24"}>
                <Reveal variant="image">
                  <Photo media={img} sizes="(min-width: 768px) 50vw, 100vw" className={i % 2 === 0 ? "aspect-[4/3]" : "aspect-[4/5]"} />
                </Reveal>
                <Caption media={img} />
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      {/* Plan CTA */}
      <section className="bg-band text-band-foreground">
        <div className="container-editorial flex flex-col gap-8 py-20 md:flex-row md:items-end md:justify-between lg:py-24">
          <Reveal as="h2" variant="lines" className="display-2 max-w-[16ch]">
            {`Your ${d.title}, planned around you`}
          </Reveal>
          <InquireLink href={planHref} location={`destination-${d.slug}-band`} variant="inverse" size="lg">
            Plan a trip to {d.title}
          </InquireLink>
        </div>
      </section>

      {/* Related */}
      {related.length ? (
        <section aria-labelledby="related-heading" className="section-pad">
          <div className="container-editorial">
            <Reveal as="h2" variant="lines" id="related-heading" className="display-2">
              You might also love
            </Reveal>
            <ul className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-[1.25fr_1fr_1fr]">
              {related.map((r, i) => (
                <li key={r.slug} className={i === 1 ? "lg:mt-16" : undefined}>
                  <DestinationCard destination={r} headingLevel="h3" aspect={i === 0 ? "aspect-[4/5]" : "aspect-[3/4]"} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
            { "@type": "ListItem", position: 2, name: "Destinations", item: absoluteUrl("/destinations") },
            { "@type": "ListItem", position: 3, name: d.title, item: absoluteUrl(`/destinations/${d.slug}`) },
          ],
        }}
      />
    </>
  )
}
