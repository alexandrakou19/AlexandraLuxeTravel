import Link from "next/link"

import type { SiteSettings } from "@/content/types"

import { InquireLink } from "./inquire-link"
import { Logo } from "./logo"
import { SocialLinks } from "./social-links"

export function SiteFooter({ site }: { site: SiteSettings }) {
  const year = new Date().getFullYear()
  return (
    <footer className="grain relative overflow-hidden bg-band text-band-foreground">
      <div className="container-editorial relative pt-16 pb-10 lg:pt-24">
        <div className="grid gap-14 pb-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Logo tone="light" className="w-52" />
            <p className="mt-8 max-w-[38ch] text-band-soft">{site.tagline}</p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <InquireLink location="footer" variant="inverse" size="sm">
                Start planning
              </InquireLink>
              <span className="font-heading text-[1.15rem] text-champagne italic">No additional planning fee</span>
            </div>
          </div>

          <nav aria-label="Footer" className="lg:col-span-3 lg:col-start-7">
            <p className="eyebrow text-band-soft!">Explore</p>
            <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-[0.95rem] lg:grid-cols-1">
              {[{ label: "Home", href: "/" }, ...site.nav, { label: "Inquire", href: "/inquire" }].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="link-draw">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <p className="eyebrow text-band-soft!">Say hello</p>
            <a href={`mailto:${site.email}`} className="link-draw mt-5 inline-block text-[0.95rem] break-all">
              {site.email}
            </a>
            <SocialLinks links={site.social} className="mt-4 -ml-3" />
            {site.credentials.length ? (
              <ul className="mt-8 space-y-1.5 text-[0.85rem] text-band-soft">
                {site.credentials.map((c) => (
                  <li key={c.id}>{c.name}</li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-band-foreground/15 pt-8 text-[0.8rem] text-band-soft md:flex-row md:items-center md:justify-between">
          <span>
            © {year} {site.name}. All rights reserved.
          </span>
          <Link href="/privacy" className="link-draw self-start">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  )
}
