// GA4 events from the brief (section 7). No-ops until NEXT_PUBLIC_GA_ID is set.

type EventName =
  | "inquiry_start"
  | "inquiry_step"
  | "generate_lead"
  | "contact_submit"
  | "click_inquire"
  | "click_social"

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export function track(event: EventName, params: Record<string, string | number> = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return
  window.gtag("event", event, params)
}
