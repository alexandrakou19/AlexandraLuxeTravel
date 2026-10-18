import { brand, photo } from "./media"
import type { SiteSettings, Testimonial } from "./types"

export const siteSettings: SiteSettings = {
  name: "Alexandra Luxe Travel",
  shortName: "Alexandra",
  tagline: "Luxury family travel, international adventures and once-in-a-lifetime journeys.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://alexandraluxetravel.com",
  logo: brand("logo-full"),
  monogram: brand("logo-monogram"),
  email: "alexandrajohnson@travelmation.net",
  social: [
    {
      network: "instagram",
      label: "Instagram",
      handle: "@alexandraluxetravel19",
      url: "https://instagram.com/alexandraluxetravel19",
    },
    {
      network: "facebook",
      label: "Facebook",
      url: "https://www.facebook.com/share/1cEMD44k6d/",
    },
    {
      network: "pinterest",
      label: "Pinterest",
      url: "https://pin.it/4ZM9SXlE4",
    },
  ],
  credentials: [
    { id: "travelmation", name: "Affiliated with Travelmation", logo: brand("badge-travelmation") },
    { id: "travelmation-luxury", name: "Travelmation Luxury Certified", logo: brand("badge-travelmation-luxury") },
    { id: "sandals-elite", name: "Sandals Elite Advisor 2026", logo: brand("badge-sandals-elite") },
    // REVIEW(Saad): client mentioned a destination wedding certification; exact name and logo not yet provided.
    { id: "wedding", name: "Destination Wedding Certified" },
  ],
  testimonialsEnabled: true,
  // REVIEW(Saad): reply-time promise to confirm with the client (brief section 11).
  replyTimePromise: "within one business day",
  notificationEmail: "alexandrajohnson@travelmation.net",
  nav: [
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Destinations", href: "/destinations" },
    { label: "Testimonials", href: "/testimonials" },
    { label: "Contact", href: "/contact" },
  ],
  headerCta: { label: "Inquire", href: "/inquire" },
  defaultSeoImage: photo("karnak-red-dress"),
}

// Real reviews from the client folder only. ("Jordan" was listed without a quote and is omitted.)
export const testimonials: Testimonial[] = [
  {
    id: "jackie",
    quote:
      "Alexandra was so responsive. I inquired at 9 am and had the trip booked and ready by 3 pm. She was honest about value and experiences that were worth it and ones that were not. She has extensive knowledge in my destination. I feel prepared for my trip and am so excited. I know Alexandra will be in my corner throughout the trip, which is reassuring.",
    clientName: "Jackie",
    trip: "A trip booked in a single day",
    featured: true,
    order: 1,
  },
  {
    id: "abby",
    quote:
      "I told Alexandra I want to take my kids to Disney World in the most luxurious way possible. The quoting process was seamless. My family and I enjoyed Disney World without the hassle of planning and without feeling overwhelmed about how to spend each day at the parks. She has great suggestions for what is appropriate for children of all age groups.",
    clientName: "Abby",
    trip: "Family trip to Disney World",
    tripType: "family",
    featured: true,
    order: 2,
  },
  {
    id: "gloria",
    quote:
      "I told Alexandra I wanted to partake in a luxury cruise and let her know my budget. She had a quote prepared the same day. I was able to find a trip that perfectly fits me and my price range. Thanks Alexandra!",
    clientName: "Gloria",
    trip: "Luxury cruise",
    tripType: "adventure",
    featured: true,
    order: 3,
  },
]
