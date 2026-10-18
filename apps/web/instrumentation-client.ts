import { ROUTE_START_EVENT } from "@/lib/route-events"

/**
 * Runs in the browser before the app is interactive. Next calls onRouterTransitionStart for every
 * App Router navigation (links, router.push, back/forward); the site's RouteProgress bar listens.
 */
export function onRouterTransitionStart(url: string) {
  // Same page (hash links, re-clicking the current link): nothing will change, so no bar.
  if (new URL(url, window.location.href).pathname === window.location.pathname) return
  window.dispatchEvent(new Event(ROUTE_START_EVENT))
}
