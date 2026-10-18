import { RichText } from "@payloadcms/richtext-lexical/react"
import type { Metadata } from "next"

import { PageHero } from "@/components/editorial/page-hero"
import { getPrivacyPolicy } from "@/lib/content"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Alexandra Luxe Travel collects, uses and protects the information you share.",
  alternates: { canonical: "/privacy" },
}

export default async function PrivacyPage() {
  const policy = await getPrivacyPolicy()
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy">
        <p>{policy.intro}</p>
      </PageHero>
      <section className="container-editorial pb-24 lg:pb-32">
        <div className="max-w-[68ch] border-t border-hairline pt-4 lg:ml-[calc(100%/12*5)]">
          <RichText
            data={policy.content as never}
            className="[&_a]:underline [&_a]:decoration-accent-line [&_a]:underline-offset-4 [&_h2]:font-heading [&_h2]:text-[clamp(1.625rem,1.3rem+1.2vw,2.25rem)] [&_h2]:leading-[1.15] [&_h2]:mt-10 [&_h2]:border-t [&_h2]:border-hairline [&_h2]:pt-10 [&_h2:first-child]:mt-6 [&_h2:first-child]:border-0 [&_h2:first-child]:pt-0 [&_h3]:mt-8 [&_h3]:font-heading [&_h3]:text-[1.4rem] [&_li]:mt-2 [&_p]:mt-4 [&_p]:text-ink-soft [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-ink-soft"
          />
          <p className="mt-12 border-t border-hairline pt-8 text-[0.85rem] text-ink-soft">Last updated {policy.lastUpdated}.</p>
        </div>
      </section>
    </>
  )
}
