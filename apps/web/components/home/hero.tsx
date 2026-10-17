"use client"

import Link from "next/link"
import { useRef } from "react"

import { gsap, prefersReducedMotion, useGSAP } from "@/components/motion/gsap"
import { Photo } from "@/components/editorial/photo"
import { InquireLink } from "@/components/site/inquire-link"
import type { HomePage } from "@/content/types"
import { buttonVariants } from "@workspace/ui/components/button"

/**
 * Full-bleed opener. The photo is painted immediately (it is the LCP element);
 * only a slow settle and a gentle scroll-away are layered on top.
 */
export function Hero({ hero }: { hero: HomePage["hero"] }) {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      })
      tl.to("[data-hero-media]", { yPercent: 12, scale: 1.06, ease: "none" }, 0)
      tl.to("[data-hero-copy]", { yPercent: -18, autoAlpha: 0, ease: "none" }, 0)
    },
    { scope: root }
  )

  return (
    <section
      ref={root}
      data-hero-overlay
      aria-labelledby="hero-heading"
      className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-espresso text-ivory"
    >
      <div data-hero-media className="absolute inset-0 -z-10 will-change-transform">
        <Photo
          media={hero.image}
          priority
          sizes="100vw"
          className="hero-settle absolute inset-0 bg-espresso"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(to_top,rgb(30_26_23/0.82)_0%,rgb(30_26_23/0.35)_42%,rgb(30_26_23/0.05)_70%),linear-gradient(to_right,rgb(30_26_23/0.45),transparent_60%)]"
        />
      </div>

      <div data-hero-copy className="container-editorial relative pt-40 pb-14 md:pb-20 lg:pb-24">
        <div className="max-w-[46rem]">
          <h1 id="hero-heading" className="display-1 text-ivory">
            <span className="mask-line">
              <span style={{ animationDelay: "250ms" }}>{hero.headline}</span>
            </span>
            <span className="mask-line">
              <span style={{ animationDelay: "380ms" }}>
                <em className="font-medium text-sand italic">{hero.headlineAccent}</em>
              </span>
            </span>
          </h1>
          <p className="rise-in mt-7 max-w-[40ch] text-[1.0625rem] leading-[1.7] font-light text-ivory/90 md:text-lg [animation-delay:600ms]">
            {hero.subhead}
          </p>
          <div className="rise-in mt-10 flex flex-wrap items-center gap-3 [animation-delay:760ms]">
            <InquireLink location="home-hero" variant="inverse" size="lg">
              Start planning
            </InquireLink>
            <Link href="/destinations" className={buttonVariants({ variant: "outline-light", size: "lg" })}>
              Explore destinations
            </Link>
          </div>
        </div>

        <div className="rise-in mt-14 flex items-center justify-between gap-6 border-t border-ivory/25 pt-5 text-[0.8rem] tracking-[0.04em] text-ivory/80 [animation-delay:1000ms]">
          <span>{hero.image.caption}</span>
          <span aria-hidden className="hidden items-center gap-3 sm:flex">
            Scroll
            <span className="scroll-cue relative block h-8 w-px overflow-hidden bg-ivory/25" />
          </span>
        </div>
      </div>
    </section>
  )
}
