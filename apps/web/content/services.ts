import { photo } from "./media"
import type { Service } from "./types"

// Service descriptions are Alexandra's own words from the client folder.
// REVIEW(Saad): "included" and "ideal for" lines are short connecting copy written in her tone.
export const services: Service[] = [
  {
    id: "family",
    anchor: "family",
    title: "Luxury Family Travel",
    shortTitle: "Families",
    summary:
      "Customized international vacations for families who want incredible destinations, beautiful accommodations and itineraries suited to both adults and children.",
    body: [
      "Customized international vacations for families who want to experience incredible destinations while enjoying beautiful accommodations, private experiences, and thoughtful itineraries suited to both adults and children.",
      "As a mother of three, I plan the way I travel with my own children: the right room setup, a pace that leaves space for naps and gelato, and moments the grown-ups will treasure just as much as the kids.",
    ],
    included: [
      "Family-friendly luxury hotels, resorts and private villas",
      "Private experiences and guides paced for little legs",
      "Itineraries that balance adult and kid interests",
      "Advice on what is right for every age group",
    ],
    idealFor: "Parents who refuse to put extraordinary travel on hold, from first trips abroad to multi-country adventures.",
    image: photo("resort-pool-daughter"),
    tripType: "family",
    order: 1,
  },
  {
    id: "bespoke",
    anchor: "bespoke",
    title: "Bespoke International Travel",
    shortTitle: "Bespoke journeys",
    summary:
      "Personalized multi-city and multi-country journeys with carefully selected accommodations and unique experiences.",
    body: [
      "Personalized multi-city and multi-country journeys featuring carefully selected accommodations, unique experiences, and seamless travel arrangements.",
      "Every route is built around you: how you like to move, where you like to stay, and the experiences that will make the trip feel like yours.",
    ],
    included: [
      "Multi-city and multi-country routing",
      "Carefully selected hotels at every stop",
      "Seamless transfers and travel arrangements",
      "Unique, hand-picked experiences",
    ],
    idealFor: "Travelers who want a journey across Europe, Asia and beyond, planned down to the details.",
    image: photo("taipei-101"),
    tripType: "other",
    order: 2,
  },
  {
    id: "adventures",
    anchor: "adventures",
    title: "Bucket-List Adventures",
    shortTitle: "Once-in-a-lifetime",
    summary:
      "African safaris, Egypt, Machu Picchu, luxury cruises and other unforgettable adventures around the world.",
    body: [
      "Extraordinary experiences such as African safaris, exploring Egypt, visiting Machu Picchu, luxury cruises, and other unforgettable adventures around the world.",
      "These are the trips you will talk about for decades. I help you do them beautifully, with the right guides, the right timing and the comfort to enjoy every moment.",
    ],
    included: [
      "Expert guides at ancient sites and wild places",
      "Luxury cruises, including river cruises",
      "Timing advice for crowds, weather and wildlife",
      "Comfortable, beautiful places to rest in between",
    ],
    idealFor: "Anyone with a list of places they have dreamed about for years.",
    image: photo("stock-machu-picchu"),
    tripType: "adventure",
    order: 3,
  },
  {
    id: "honeymoons",
    anchor: "honeymoons",
    title: "Honeymoons & Romantic Escapes",
    shortTitle: "Honeymoons & romance",
    summary: "Beautifully curated honeymoons, anniversaries and romantic getaways for couples seeking something special.",
    body: [
      "Beautifully curated honeymoons, anniversaries, and romantic getaways for couples seeking something special.",
      "Sunset dinners, suites with a view and the quiet luxury of not having to think about a thing. You simply arrive and enjoy each other.",
    ],
    included: [
      "Romantic resorts, villas and boutique hotels",
      "Honeymoon and anniversary touches where available",
      "Private dinners, spa time and experiences for two",
      "Island-hopping and multi-stop routes",
    ],
    idealFor: "Newlyweds, anniversaries and couples who simply want time together somewhere unforgettable.",
    image: photo("stock-santorini-oia"),
    tripType: "honeymoon",
    order: 4,
  },
  {
    id: "weddings",
    anchor: "weddings",
    title: "Destination Weddings",
    shortTitle: "Destination weddings",
    summary:
      "Help discovering extraordinary wedding destinations and coordinating travel and accommodations for your celebration.",
    body: [
      "Helping couples discover extraordinary wedding destinations and coordinate travel arrangements and accommodations for their celebrations.",
      "From the first shortlist of venues to rooms for every guest, I take care of the travel so you can focus on the day itself.",
    ],
    included: [
      "Destination and resort shortlists for your style",
      "Guest travel and accommodation coordination",
      "Honeymoon planning to follow the celebration",
    ],
    idealFor: "Couples dreaming of saying “I do” somewhere beautiful, with the people they love around them.",
    image: photo("stock-caribbean-beach"),
    tripType: "wedding",
    order: 5,
  },
  {
    id: "groups",
    anchor: "groups",
    title: "Group & Multigenerational Travel",
    shortTitle: "Groups & generations",
    summary: "Family reunions, milestone celebrations, girls’ trips and vacations bringing multiple generations together.",
    body: [
      "Family reunions, milestone celebrations, girls’ trips, and vacations bringing multiple generations together.",
      "Larger groups need more careful planning: rooms that keep everyone close, experiences that suit every age, and one trusted person keeping it all on track.",
    ],
    included: [
      "Accommodations that keep the whole group together",
      "Experiences that work for every generation",
      "Celebration dinners and milestone moments",
      "One point of contact for the entire group",
    ],
    idealFor: "Reunions, big birthdays, girls’ trips and grandparents traveling with grandchildren.",
    image: photo("paris-family-eiffel"),
    tripType: "group",
    order: 6,
  },
]
