import type { ReactNode } from "react"

import { SmoothScroll } from "@/components/motion/smooth-scroll"
import { getSiteSettings } from "@/lib/content"
import { absoluteUrl } from "@/lib/utils"

import { JsonLd } from "./json-ld"
import { SiteFooter } from "./site-footer"
import { SiteHeader } from "./site-header"

/** Header, footer, smooth scrolling and site-wide JSON-LD around every public page. */
export async function SiteChrome({ children }: { children: ReactNode }) {
  const site = await getSiteSettings()
  return (
    <SmoothScroll>
      <SiteHeader nav={site.nav} cta={site.headerCta} social={site.social} email={site.email} />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <SiteFooter site={site} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "TravelAgency",
          name: site.name,
          url: site.url,
          logo: absoluteUrl(site.logo.src),
          image: absoluteUrl(site.defaultSeoImage.src),
          email: site.email,
          description: site.tagline,
          sameAs: site.social.map((s) => s.url),
          areaServed: "Worldwide",
        }}
      />
    </SmoothScroll>
  )
}
