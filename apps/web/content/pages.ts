import { photo } from "./media"
import type { AboutPage, HomePage, InquiryPage, ProcessStep, ServicesPage } from "./types"

// Her process, in her words: inquiry form, then a rough draft amended to your vision and budget.
// REVIEW(Saad): expanded into four steps from the two-line process in the client folder.
export const processSteps: ProcessStep[] = [
  {
    title: "Share your vision",
    body: "Complete the inquiry form with your dates, dream destinations, budget and what you are envisioning. The more you share, the more personal it gets.",
  },
  {
    title: "Receive your first draft",
    body: "I prepare a rough draft of your trip: where to stay, what to experience and how it all fits together.",
  },
  {
    title: "Shape it together",
    body: "We refine the draft until it matches your vision and your budget exactly, with price matching where it helps.",
  },
  {
    title: "Travel beautifully",
    body: "Everything is booked and in place. While you are away, my 24-hour emergency line means you are never on your own.",
  },
]

export const amenities = [
  "Firsthand expertise",
  "24-hour emergency line",
  "Hassle-free planning",
  "Early check-in & late checkout when available",
  "Free breakfast",
  "Welcome gift",
  "Spa credits when available",
  "Price match capabilities",
]

export const planningFeeLine =
  "Personalized travel planning, thoughtfully curated for you, with no additional planning fee."

export const homePage: HomePage = {
  hero: {
    image: photo("karnak-red-dress"),
    headline: "Extraordinary journeys,",
    headlineAccent: "thoughtfully yours",
    subhead:
      "Luxury family travel is my signature, and every couple, honeymooner and curious traveler is warmly welcome.",
  },
  meet: {
    portrait: photo("london-portrait"),
    secondary: photo("paris-family-seine"),
    heading: "Hello, I’m Alexandra.",
    body: [
      "Travel has always been one of my greatest passions. From historic European cities and ancient wonders to tropical islands, I have developed a deep appreciation for everything the world has to offer.",
      "I started Alexandra Luxe Travel to bring my firsthand experience and my love for planning to your journey, so it feels personal, thoughtfully curated and as effortless as possible.",
    ],
  },
  stats: [
    { value: 30, suffix: "+", label: "Countries explored" },
    { value: 40, suffix: "+", label: "U.S. states" },
    { value: 400, suffix: "", label: "Destinations across continents" },
  ],
  signature: {
    images: [photo("paris-family-eiffel"), photo("canyon-family-hike")],
    eyebrow: "The signature",
    heading: "Having children doesn’t mean putting extraordinary adventures on hold.",
    body: [
      "As a wife and mother of three who loves international travel, I believe some of life’s most meaningful memories come from exploring new places together.",
      "I design family journeys with beautiful accommodations, private experiences and itineraries that delight the grown-ups as much as the kids.",
    ],
  },
  journeys: {
    items: [], // seeded separately (they link to services in the CMS)
    heading: "Journeys for every traveler",
    intro:
      "Families are my signature, but every trip receives the same care. I specialize in luxury experiences and work with many travel styles and budgets.",
  },
  amenities,
  planningFeeLine,
  process: {
    heading: "Simple, personal, effortless",
    intro: "Planning with me is approachable from the very first message.",
    steps: processSteps,
  },
  destinations: {
    heading: "Where to next?",
    intro: "A few of the places I love sending travelers. Every journey is tailored, so treat these as a beginning.",
  },
  instagram: {
    heading: "Follow along",
    images: [
      photo("london-portrait"),
      photo("resort-pool-daughter"),
      photo("milan-duomo-family"),
      photo("taipei-101"),
      photo("river-cruise-deck"),
      photo("canyon-family-hike"),
      photo("paris-family-seine"),
    ],
  },
  closing: {
    heading: "Ready to start planning?",
    body: "Tell me where you are dreaming of going. I will take it from there.",
    image: photo("paris-family-seine"),
  },
}

export const aboutPage: AboutPage = {
  portrait: photo("london-portrait"),
  headline: "Traveling opened my mind in a way everyone should experience.",
  intro:
    "I’m Alexandra: wife, mother of three and the founder of Alexandra Luxe Travel. I have explored over 30 countries, more than 40 U.S. states and 400 destinations across multiple continents.",
  story: [
    "Travel has always been one of my greatest passions. From wandering through historic European cities and exploring ancient wonders to discovering tropical islands and experiencing different cultures, I’ve developed a deep appreciation for everything the world has to offer.",
    "I started Alexandra Luxe Travel to combine my firsthand travel experience, love for planning and passion for discovering extraordinary destinations to help others create unforgettable experiences of their own.",
    "My goal is to make travel feel personal, thoughtfully curated and as effortless as possible, whether that’s a luxury family adventure through Europe, a bucket-list journey through Asia, a romantic honeymoon or a beautiful destination wedding.",
  ],
  family: {
    heading: "Exploring the world, together",
    body: [
      "As a mother who loves international travel, I believe having children shouldn’t mean putting extraordinary adventures on hold. Some of life’s most meaningful memories come from exploring new places together.",
      "That said, my planning is never one-size-fits-all. Couples, honeymooners, friends and solo travelers receive exactly the same care and attention to detail.",
    ],
    image: photo("milan-duomo-family"),
  },
  philosophy: [
    {
      title: "Luxury isn’t a price tag",
      body: "It’s about exceptional experiences, beautiful accommodations, thoughtful details and memories that last a lifetime.",
    },
    {
      title: "Personal, never packaged",
      body: "Every itinerary starts with you: how you travel, what you love and the moments you’re hoping for.",
    },
    {
      title: "In your corner, start to finish",
      body: "From the first draft to a 24-hour emergency line while you travel, you are never on your own.",
    },
  ],
  gallery: [
    photo("karnak-red-dress"),
    photo("paris-family-eiffel"),
    photo("taipei-101"),
    photo("canyon-family-hike"),
    photo("resort-pool-daughter"),
    photo("river-cruise-deck"),
  ],
}

export const servicesPage: ServicesPage = {
  intro:
    "Every journey I plan is personal, thoughtfully curated and as effortless as possible. Luxury family travel is my signature, and I bring the same care to every kind of trip.",
  styles:
    "Although I specialize in luxury experiences, I work with many travel styles and budgets. Luxury, to me, is about the experience, not the price tag.",
  planningFee: planningFeeLine,
  processIntro: "Simple and approachable, from the first message to the moment you are home again.",
}

export const inquiryPage: InquiryPage = {
  intro:
    "Tell me about the trip you are dreaming of. It takes about three minutes, and every answer helps me prepare a first draft that already feels like yours.",
  budgetRanges: [
    "Under $5,000",
    "$5,000 – $10,000",
    "$10,000 – $20,000",
    "$20,000 – $35,000",
    "$35,000 – $50,000",
    "$50,000+",
    "Not sure yet",
  ],
  thankYou: {
    heading: "Thank you. Your journey has begun.",
    body: "Your inquiry is with me. I read every one personally.",
    nextSteps: [
      { title: "I review your answers", body: "I’ll look closely at your dates, destinations and wishes." },
      { title: "I reach out", body: "Expect a personal reply from me with any questions." },
      { title: "Your first draft", body: "I prepare a rough draft of your trip, ready to shape together." },
    ],
  },
}
