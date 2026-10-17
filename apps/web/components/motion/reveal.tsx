"use client"

import { useRef, type ElementType, type HTMLAttributes, type ReactNode } from "react"

import { cn } from "@workspace/ui/lib/utils"

import { gsap, prefersReducedMotion, SplitText, useGSAP } from "./gsap"

type Variant = "lines" | "fade" | "stagger" | "image"

type RevealProps = Omit<HTMLAttributes<HTMLElement>, "children" | "className" | "id"> & {
  as?: ElementType
  variant?: Variant
  className?: string
  children: ReactNode
  delay?: number
  /** ScrollTrigger start position. */
  start?: string
  id?: string
}

/**
 * Scroll-triggered editorial reveals. Content is fully visible without JavaScript
 * and with reduced motion; GSAP only sets the start state once it is running.
 *  - lines: heading lines rise out of a mask (SplitText)
 *  - fade: the block fades and rises
 *  - stagger: direct children marked [data-reveal-item] cascade in
 *  - image: a curtain clip opens while the photo settles from a slight zoom
 */
export function Reveal({
  as: Tag = "div",
  variant = "fade",
  className,
  children,
  delay = 0,
  start = "top 86%",
  id,
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el || prefersReducedMotion()) return
      const scrollTrigger = { trigger: el, start, once: true }

      if (variant === "lines") {
        const split = SplitText.create(el, {
          type: "lines",
          mask: "lines",
          linesClass: "reveal-line",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, { yPercent: 105, duration: 1.25, stagger: 0.09, delay, scrollTrigger }),
        } as SplitText.Vars)
        return () => split.revert()
      }

      if (variant === "image") {
        const media = el.querySelector("img")
        const tl = gsap.timeline({ scrollTrigger, delay })
        tl.fromTo(el, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "expo.inOut" })
        if (media) tl.from(media, { scale: 1.18, duration: 2, ease: "expo.out" }, 0.15)
        return
      }

      if (variant === "stagger") {
        const items = el.querySelectorAll("[data-reveal-item]")
        gsap.from(items, { y: 32, autoAlpha: 0, duration: 1.1, stagger: 0.1, delay, scrollTrigger })
        return
      }

      gsap.from(el, { y: 36, autoAlpha: 0, duration: 1.2, delay, scrollTrigger })
    },
    { scope: ref, dependencies: [variant] }
  )

  return (
    <Tag ref={ref} id={id} {...rest} className={cn(variant === "image" && "overflow-hidden", className)}>
      {children}
    </Tag>
  )
}
