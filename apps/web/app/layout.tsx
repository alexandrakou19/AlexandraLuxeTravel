import type { Metadata, Viewport } from "next"
import { Cormorant_Garamond, Jost } from "next/font/google"
import Script from "next/script"

import "@workspace/ui/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { getSiteSettings } from "@/lib/content"
import { cn } from "@workspace/ui/lib/utils"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  // Variable font: one file per style covers weights 500 and 600.
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
})

const jost = Jost({
  subsets: ["latin"],
  // Variable font: a single file covers 300, 400 and 500.
  variable: "--font-jost",
  display: "swap",
})

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
      images: [{ url: site.defaultSeoImage.src, width: site.defaultSeoImage.width, height: site.defaultSeoImage.height, alt: site.defaultSeoImage.alt }],
    },
    twitter: { card: "summary_large_image" },
    alternates: { canonical: "/" },
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f3ee" },
    { media: "(prefers-color-scheme: dark)", color: "#1e1a17" },
  ],
}

const gaId = process.env.NEXT_PUBLIC_GA_ID

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("antialiased", cormorant.variable, jost.variable)}>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
        {gaId ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${gaId}');`}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  )
}
