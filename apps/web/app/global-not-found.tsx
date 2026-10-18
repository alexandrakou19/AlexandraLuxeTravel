import type { Metadata } from "next"

import { HtmlShell } from "@/components/site/html-shell"
import { NotFoundContent } from "@/components/site/not-found-content"
import { SiteChrome } from "@/components/site/site-chrome"

// The site and the CMS admin have separate root layouts, so unmatched URLs use this page.
export const metadata: Metadata = { title: "Page not found · Alexandra Luxe Travel" }

export default function GlobalNotFound() {
  return (
    <HtmlShell>
      <SiteChrome>
        <NotFoundContent />
      </SiteChrome>
    </HtmlShell>
  )
}
