import { Cormorant_Garamond, Jost } from "next/font/google"

export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  // Variable font: one file per style covers weights 500 and 600.
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
})

export const jost = Jost({
  subsets: ["latin"],
  // Variable font: a single file covers 300, 400 and 500.
  variable: "--font-jost",
  display: "swap",
})
