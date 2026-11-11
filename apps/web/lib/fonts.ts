import { Montserrat, Playfair_Display } from "next/font/google"

export const playfair = Playfair_Display({
  subsets: ["latin"],
  // Variable font: one file per style covers weights 400 through 700.
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
})

export const montserrat = Montserrat({
  subsets: ["latin"],
  // Variable font: a single file covers 300, 400 and 500.
  variable: "--font-montserrat",
  display: "swap",
})
