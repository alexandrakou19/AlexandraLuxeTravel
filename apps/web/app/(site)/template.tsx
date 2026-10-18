"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState, ViewTransition, type ReactNode } from "react"

/** Set once the first page has hydrated; every page mounted after that arrived by navigation. */
let hydrated = false

/**
 * Every page enters and leaves through here. With View Transitions the old page lifts away and
 * the new one is revealed down the page (globals.css, "Route changes") while the header stays
 * anchored. The page a visitor lands on never animates: it holds the LCP image.
 */
export default function Template({ children }: { children: ReactNode }) {
  // Keyed on the full path: the template itself persists between sibling pages such as
  // /destinations and /destinations/egypt, and every page change should enter and exit.
  const pathname = usePathname()
  return (
    <ViewTransition key={pathname} enter="page-in" exit="page-out" default="none">
      <Page>{children}</Page>
    </ViewTransition>
  )
}

/** Browsers without View Transitions get a soft fade instead. */
function Page({ children }: { children: ReactNode }) {
  const [fallbackFade] = useState(() => hydrated && !("startViewTransition" in document))
  useEffect(() => {
    hydrated = true
  }, [])
  return <div className={fallbackFade ? "page-enter" : undefined}>{children}</div>
}
