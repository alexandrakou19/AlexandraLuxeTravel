"use client"

import Lenis from "lenis"
import { usePathname } from "next/navigation"
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react"

import { gsap, prefersReducedMotion, ScrollTrigger } from "./gsap"

const LenisContext = createContext<Lenis | null>(null)

export const useLenis = () => useContext(LenisContext)

/** Lenis smooth scrolling driven by the GSAP ticker, so ScrollTrigger stays in sync. Off for reduced motion. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)
  const pathname = usePathname()
  const first = useRef(true)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const instance = new Lenis({ duration: 1.15, smoothWheel: true, anchors: { offset: -96 } })
    const raf = (time: number) => instance.raf(time * 1000)
    instance.on("scroll", ScrollTrigger.update)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    setLenis(instance)
    return () => {
      gsap.ticker.remove(raf)
      instance.destroy()
      setLenis(null)
    }
  }, [])

  // New page: jump to top instantly and re-measure triggers.
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    if (!window.location.hash) lenis?.scrollTo(0, { immediate: true, force: true })
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120)
    return () => window.clearTimeout(id)
  }, [pathname, lenis])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}
