import type { Metadata } from "next"

import { NotFoundContent } from "@/components/site/not-found-content"
import { SiteChrome } from "@/components/site/site-chrome"

export const metadata: Metadata = { title: "Page not found" }

export default function NotFound() {
  return (
    <SiteChrome>
      <NotFoundContent />
    </SiteChrome>
  )
}
