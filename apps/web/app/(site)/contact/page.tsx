import type { Metadata } from "next"

import { PageHero } from "@/components/editorial/page-hero"
import { Photo } from "@/components/editorial/photo"
import { ContactForm } from "@/components/forms/contact-form"
import { Reveal } from "@/components/motion/reveal"
import { InquireLink } from "@/components/site/inquire-link"
import { SocialLinks } from "@/components/site/social-links"
import { photo } from "@/content/media"
import { getContactPage, getSiteSettings } from "@/lib/content"

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Alexandra Luxe Travel. For trip planning, use the travel inquiry form.",
  alternates: { canonical: "/contact" },
}

export default async function ContactPage() {
  const [site, page] = await Promise.all([getSiteSettings(), getContactPage()])
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Let’s <em className="italic">talk</em>
          </>
        }
      >
        <p>
          {page.intro} I reply {site.replyTimePromise}.
        </p>
      </PageHero>

      <section className="container-editorial pb-24 lg:pb-32">
        {/* Planning a trip? -> the full inquiry form */}
        <Reveal className="grid overflow-hidden bg-band text-band-foreground md:grid-cols-[1fr_1.3fr]">
          <Photo media={photo("karnak-red-dress")} sizes="(min-width: 768px) 40vw, 100vw" className="aspect-[16/10] md:aspect-auto md:min-h-[22rem]" />
          <div className="flex flex-col justify-center px-6 py-10 md:px-12 md:py-14">
            <h2 className="display-2">{page.panelHeading}</h2>
            <p className="mt-4 max-w-[42ch] text-band-soft">{page.panelBody}</p>
            <div className="mt-8">
              <InquireLink location="contact-panel" variant="inverse">
                Start your travel inquiry
              </InquireLink>
            </div>
          </div>
        </Reveal>

        <div className="mt-20 grid gap-14 lg:mt-28 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <h2 className="display-3">Get in touch</h2>
            <dl className="mt-8 space-y-7">
              <div>
                <dt className="eyebrow">Email</dt>
                <dd className="mt-2">
                  <a href={`mailto:${site.email}`} className="link-draw break-all">
                    {site.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="eyebrow">Follow along</dt>
                <dd className="mt-1">
                  <SocialLinks links={site.social} className="-ml-3" />
                </dd>
              </div>
            </dl>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <h2 className="display-3">Send a message</h2>
            <div className="mt-8">
              <ContactForm replyTimePromise={site.replyTimePromise} />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
