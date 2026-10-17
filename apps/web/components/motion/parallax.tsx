"use client"

import { useRef, type ReactNode } from "react"

import { gsap, prefersReducedMotion, useGSAP } from "./gsap"

/** A gentle scroll drift (a few percent at most). The brief asks for subtle depth, not parallax-heavy effects. */
export function Drift({ children, amount = 8, className }: { children: ReactNode; amount?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      if (!ref.current || prefersReducedMotion()) return
      gsap.fromTo(
        ref.current,
        { yPercent: amount / 2 },
        {
          yPercent: -amount / 2,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
        }
      )
    },
    { scope: ref }
  )
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
