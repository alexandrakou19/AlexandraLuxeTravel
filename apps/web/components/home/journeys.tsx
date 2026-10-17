"use client"

import { ArrowUpRight } from "@phosphor-icons/react"
import Image from "next/image"
import Link from "next/link"
import { useRef, useState } from "react"

import { finePointer, gsap, prefersReducedMotion, useGSAP } from "@/components/motion/gsap"
import { Reveal } from "@/components/motion/reveal"
import type { Media } from "@/content/types"
import { cn } from "@workspace/ui/lib/utils"

export type Journey = { title: string; line: string; href: string; image: Media }

/**
 * An editorial index of trip styles. On desktop a photo preview follows the cursor
 * and cross-fades between journeys; on touch screens each row carries its own thumbnail.
 */
export function Journeys({ heading, intro, journeys }: { heading: string; intro: string; journeys: Journey[] }) {
  const root = useRef<HTMLElement>(null)
  const preview = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<number | null>(null)

  const { contextSafe } = useGSAP(
    () => {
      if (!preview.current) return
      gsap.set(preview.current, { xPercent: -50, yPercent: -50, autoAlpha: 0, scale: 0.85 })
    },
    { scope: root }
  )

  const move = contextSafe((e: React.PointerEvent) => {
    if (!preview.current || !finePointer()) return
    const box = root.current!.getBoundingClientRect()
    gsap.to(preview.current, {
      x: e.clientX - box.left,
      y: e.clientY - box.top,
      duration: prefersReducedMotion() ? 0 : 0.9,
      ease: "expo.out",
    })
  })

  const show = contextSafe((i: number) => {
    setActive(i)
    if (!preview.current || !finePointer()) return
    gsap.to(preview.current, { autoAlpha: 1, scale: 1, duration: 0.7, ease: "expo.out" })
  })

  const hide = contextSafe(() => {
    setActive(null)
    if (!preview.current) return
    gsap.to(preview.current, { autoAlpha: 0, scale: 0.85, duration: 0.5, ease: "expo.out" })
  })

  return (
    <section ref={root} aria-labelledby="journeys-heading" className="section-pad relative" onPointerMove={move}>
      <div className="container-editorial">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <Reveal as="h2" variant="lines" id="journeys-heading" className="display-2 lg:col-span-6">
            {heading}
          </Reveal>
          <Reveal className="lede lg:col-span-5 lg:col-start-8">
            <p>{intro}</p>
          </Reveal>
        </div>

        <Reveal as="ul" variant="stagger" className="mt-14 border-t border-hairline lg:mt-20" start="top 80%">
          {journeys.map((j, i) => (
            <li key={j.title} data-reveal-item className="border-b border-hairline">
              <Link
                href={j.href}
                onPointerEnter={() => show(i)}
                onPointerLeave={hide}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className="group grid grid-cols-[4.5rem_1fr_auto] items-center gap-5 py-5 md:grid-cols-[1fr_auto] md:py-7 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_auto] lg:gap-10"
              >
                <span className="relative block aspect-[4/5] overflow-hidden md:hidden">
                  <Image src={j.image.src} alt="" fill sizes="72px" className="object-cover" style={{ objectPosition: j.image.focal }} />
                </span>
                <span
                  className={cn(
                    "font-heading text-[clamp(1.75rem,1.2rem+2.2vw,3.25rem)] leading-[1.05] transition-[transform,color] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    "lg:group-hover:translate-x-3",
                    active !== null && active !== i ? "lg:text-ink-soft/60" : ""
                  )}
                >
                  {j.title}
                </span>
                <span className="hidden max-w-[38ch] text-ink-soft lg:block">{j.line}</span>
                <span
                  aria-hidden
                  className="inline-flex size-11 items-center justify-center rounded-full border border-hairline transition-all duration-500 group-hover:border-foreground group-hover:bg-foreground group-hover:text-background"
                >
                  <ArrowUpRight weight="light" className="size-4 transition-transform duration-500 group-hover:rotate-45" />
                </span>
              </Link>
            </li>
          ))}
        </Reveal>
      </div>

      {/* Cursor-follow preview (desktop, decorative). */}
      <div
        ref={preview}
        aria-hidden
        className="pointer-events-none invisible absolute top-0 left-0 z-10 hidden aspect-[4/5] w-[19rem] overflow-hidden lg:block"
      >
        {journeys.map((j, i) => (
          <Image
            key={j.title}
            src={j.image.src}
            alt=""
            fill
            sizes="304px"
            className={cn(
              "object-cover transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
              active === i ? "scale-100 opacity-100" : "scale-110 opacity-0"
            )}
            style={{ objectPosition: j.image.focal }}
          />
        ))}
      </div>
    </section>
  )
}
