import type { Metadata, Viewport } from "next"

import { HtmlShell } from "@/components/site/html-shell"
import { SiteChrome } from "@/components/site/site-chrome"
import { getSiteSettings } from "@/lib/content"

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSettings()
  return {
    metadataBase: new URL(site.url),
    title: {
      default: `${site.name} · Luxury Family Travel & Once-in-a-Lifetime Journeys`,
      template: `%s · ${site.name}`,
    },
    description:
      "Personalized luxury travel planning by Alexandra: luxury family travel, honeymoons, destination weddings and bucket-list adventures around the world.",
    applicationName: site.name,
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: "en_US",
      images: [
        {
          url: site.defaultSeoImage.src,
          width: site.defaultSeoImage.width,
          height: site.defaultSeoImage.height,
          alt: site.defaultSeoImage.alt,
        },
      ],
    },
    twitter: { card: "summary_large_image" },
    verification: {
      other: {
        "p:domain_verify": "088c6d7f5b70311e59f0be0583e38865",
      },
    },
    alternates: { canonical: "/" },
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f3ee" },
    { media: "(prefers-color-scheme: dark)", color: "#1e1a17" },
  ],
}

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <HtmlShell>
      <SiteChrome>{children}</SiteChrome>
    </HtmlShell>
  )
}
