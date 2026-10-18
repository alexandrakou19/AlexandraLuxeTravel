import Script from "next/script"
import type { ReactNode } from "react"

import "@workspace/ui/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cormorant, jost } from "@/lib/fonts"
import { cn } from "@workspace/ui/lib/utils"

const gaId = process.env.NEXT_PUBLIC_GA_ID

/** <html>/<body> for the public site (its own root layout, separate from the CMS admin). */
export function HtmlShell({ children }: { children: ReactNode }) {
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
