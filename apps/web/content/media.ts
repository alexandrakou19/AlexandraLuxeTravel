import { brandFiles, photoFiles } from "./media.generated"
import type { Media } from "./types"

type PhotoId = keyof typeof photoFiles
type BrandId = keyof typeof brandFiles

type Meta = Omit<Media, "id" | "src" | "width" | "height" | "blur">

const meta: Record<PhotoId, Meta> = {
  "karnak-red-dress": {
    alt: "Alexandra in a flowing red dress between the towering carved columns of Karnak Temple",
    caption: "Karnak Temple, Luxor — Egypt",
    focal: "50% 64%",
  },
  "london-portrait": {
    alt: "Alexandra smiling beside a red telephone box on a London street",
    caption: "London, England",
    focal: "55% 40%",
  },
  "mykonos-portrait": {
    alt: "Alexandra at a waterfront table at golden hour with the whitewashed houses of Mykonos behind her",
    caption: "Mykonos, Greece",
    focal: "56% 30%",
  },
  "paris-family-seine": {
    alt: "Alexandra and her family on a bridge over the Seine with the Eiffel Tower behind them",
    caption: "Along the Seine, Paris",
    focal: "55% 60%",
  },
  "paris-family-eiffel": {
    alt: "Alexandra and her family standing by the Seine with the Eiffel Tower in the distance",
    caption: "Paris, France",
    focal: "50% 60%",
  },
  "taipei-101": {
    alt: "Alexandra in a navy coat in a Taipei plaza with the Taipei 101 tower rising behind her",
    caption: "Xinyi District, Taipei — Taiwan",
    focal: "45% 55%",
  },
  "milan-duomo-family": {
    alt: "Alexandra and her family with their baby in front of the Milan Cathedral",
    caption: "Piazza del Duomo, Milan — Italy",
    focal: "50% 55%",
  },
  "canyon-family-hike": {
    alt: "Alexandra hiking with her children in Zion National Park, Utah",
    caption: "Zion National Park, Utah",
    focal: "75% 55%",
  },
  "karnak-family": {
    alt: "Alexandra with her husband and daughter between the towering columns of Karnak Temple",
    caption: "",
    focal: "50% 45%",
  },
  "resort-pool-daughter": {
    alt: "A little traveler in a floral swimsuit on a palm-lined resort pool deck",
    caption: "Poolside, family resort",
    focal: "45% 55%",
  },
  "river-cruise-deck": {
    alt: "Two young children looking out over the water from the deck of a river cruise",
    caption: "Little explorers on deck",
    focal: "40% 60%",
  },
  "stock-machu-picchu": {
    alt: "Mist drifting over the terraces of Machu Picchu beneath Huayna Picchu",
    caption: "Machu Picchu, Peru",
    credit: "https://unsplash.com/photos/photo-1526392060635-9d6019884377",
    isStock: true,
  },
  "stock-caribbean-beach": {
    alt: "Soft turquoise waves rolling onto a white sand Caribbean beach at sunrise",
    caption: "The Caribbean",
    credit: "https://unsplash.com/photos/photo-1507525428034-b723cf961d3e",
    isStock: true,
  },
  "stock-santorini-steps": {
    alt: "Whitewashed steps winding down toward the Aegean Sea in Santorini",
    caption: "Santorini, Greece",
    credit: "https://unsplash.com/photos/photo-1533105079780-92b9be482077",
    isStock: true,
    focal: "50% 60%",
  },
  "stock-santorini-oia": {
    alt: "The white cliffside village of Oia in Santorini at dusk",
    caption: "Oia, Santorini",
    credit: "https://unsplash.com/photos/photo-1570077188670-e3a8d69ac5ff",
    isStock: true,
  },
  "stock-railay-longtails": {
    alt: "Traditional longtail boats moored on a white beach beneath limestone cliffs in Krabi",
    caption: "Railay Beach, Krabi — Thailand",
    credit: "https://unsplash.com/photos/photo-1552465011-b4e21bf6e79a",
    isStock: true,
  },
  "stock-prague-bridge": {
    alt: "Charles Bridge and Prague's old town and castle along the Vltava River",
    caption: "Charles Bridge, Prague",
    credit: "https://unsplash.com/photos/photo-1519677100203-a0e668c92439",
    isStock: true,
  },
}

export function photo(id: PhotoId, overrides: Partial<Meta> = {}): Media {
  const file = photoFiles[id]
  return { id, src: file.src, width: file.width, height: file.height, blur: file.blur, ...meta[id], ...overrides }
}

const brandAlt: Record<BrandId, string> = {
  "logo-full": "Alexandra Luxe Travel",
  "logo-light": "Alexandra Luxe Travel",
  "logo-monogram": "Alexandra Luxe Travel monogram",
  "badge-sandals-elite": "Sandals Elite Advisor 2026",
  "badge-travelmation-luxury": "Travelmation Luxury Certified",
  "badge-travelmation-weddings": "Travelmation Destination Weddings Certified",
  "badge-travelmation": "Travelmation",
}

export function brand(id: BrandId): Media {
  const file = brandFiles[id]
  return { id, src: file.src, width: file.width, height: file.height, alt: brandAlt[id] }
}
