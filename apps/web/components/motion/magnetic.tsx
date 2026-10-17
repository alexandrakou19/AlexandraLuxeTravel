"use client"

import { useRef, type ReactNode } from "react"

import { cn } from "@workspace/ui/lib/utils"

import { finePointer, gsap, prefersReducedMotion, useGSAP } from "./gsap"

/** Pulls its child gently toward the cursor on fine-pointer devices. */
export function Magnetic({ children, strength = 0.28, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useGSAP(
    (_, contextSafe) => {
      const el = ref.current
      if (!el || !contextSafe || !finePointer() || prefersReducedMotion()) return
      const xTo = gsap.quickTo(el, "x", { duration: 0.9, ease: "elastic.out(1, 0.45)" })
      const yTo = gsap.quickTo(el, "y", { duration: 0.9, ease: "elastic.out(1, 0.45)" })
      const move = contextSafe((e: PointerEvent) => {
        const r = el.getBoundingClientRect()
        xTo((e.clientX - (r.left + r.width / 2)) * strength)
        yTo((e.clientY - (r.top + r.height / 2)) * strength)
      })
      const leave = contextSafe(() => {
        xTo(0)
        yTo(0)
      })
      el.addEventListener("pointermove", move)
      el.addEventListener("pointerleave", leave)
      return () => {
        el.removeEventListener("pointermove", move)
        el.removeEventListener("pointerleave", leave)
      }
    },
    { scope: ref }
  )

  return (
    <span ref={ref} className={cn("inline-flex will-change-transform", className)}>
      {children}
    </span>
  )
}
