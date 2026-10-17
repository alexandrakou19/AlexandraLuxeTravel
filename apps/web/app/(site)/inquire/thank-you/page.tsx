import type { Metadata } from "next"
import Link from "next/link"

import { Photo } from "@/components/editorial/photo"
import { LeadTracker } from "@/components/forms/lead-tracker"
import { photo } from "@/content/media"
import { getInquiryPage, getSiteSettings } from "@/lib/content"
import { buttonVariants } from "@workspace/ui/components/button"

export const metadata: Metadata = {
  title: "Thank You",
  robots: { index: false, follow: false },
}

export default async function ThankYouPage() {
  const [page, site] = await Promise.all([getInquiryPage(), getSiteSettings()])
  const instagram = site.social.find((s) => s.network === "instagram")

  return (
    <section className="container-editorial pt-28 pb-24 lg:pt-40 lg:pb-32">
      <LeadTracker />
      <div className="grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-10">
        <div className="lg:col-span-6">
          <p className="eyebrow rise-in">Inquiry received</p>
          <h1 className="display-1 rise-in mt-5 [animation-delay:80ms]">{page.thankYou.heading}</h1>
          <p className="lede rise-in mt-6 max-w-[46ch] [animation-delay:180ms]">
            {page.thankYou.body} You’ll hear from me {site.replyTimePromise}, and a confirmation is on its way to your inbox.
          </p>

          <h2 className="display-3 rise-in mt-14 [animation-delay:260ms]">What happens next</h2>
          <ol className="rise-in mt-6 border-t border-hairline [animation-delay:320ms]">
            {page.thankYou.nextSteps.map((s, i) => (
              <li key={s.title} className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-hairline py-5">
                <span className="font-heading text-[1.5rem] leading-none text-ink-soft italic">{i + 1}</span>
                <div>
                  <h3 className="font-medium">{s.title}</h3>
                  <p className="mt-1 text-ink-soft">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="rise-in mt-10 flex flex-wrap gap-3 [animation-delay:420ms]">
            <Link href="/destinations" className={buttonVariants()}>
              Explore destinations
            </Link>
            {instagram ? (
              <a href={instagram.url} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: "outline" })}>
                Follow on Instagram
              </a>
            ) : null}
          </div>
        </div>
        <div className="rise-in lg:col-span-5 lg:col-start-8 [animation-delay:150ms]">
          <Photo media={photo("canyon-family-hike")} sizes="(min-width: 1024px) 40vw, 100vw" className="aspect-[4/5]" />
        </div>
      </div>
    </section>
  )
}
