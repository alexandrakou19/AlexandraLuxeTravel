"use client"

import { useRef } from "react"

import { gsap, prefersReducedMotion, useGSAP } from "./gsap"

/** Counts up to a real number once it scrolls into view. Renders the final value on the server. */
export function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  useGSAP(
    () => {
      const el = ref.current
      if (!el || prefersReducedMotion()) return
      const counter = { n: 0 }
      el.textContent = `0${suffix}`
      gsap.to(counter, {
        n: value,
        duration: 2.2,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
        onUpdate: () => {
          el.textContent = `${Math.round(counter.n)}${suffix}`
        },
      })
    },
    { scope: ref }
  )
  return (
    <span ref={ref} className="tabular-nums">
      {value}
      {suffix}
    </span>
  )
}
