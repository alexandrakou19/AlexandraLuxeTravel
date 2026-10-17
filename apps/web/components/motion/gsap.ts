"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)
  gsap.defaults({ ease: "expo.out", duration: 1.1 })
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

export const finePointer = () => typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches

export { gsap, ScrollTrigger, SplitText, useGSAP }
