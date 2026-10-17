"use client"

import { useRef } from "react"

import { gsap, prefersReducedMotion, useGSAP } from "@/components/motion/gsap"
import { Reveal } from "@/components/motion/reveal"
import type { ProcessStep } from "@/content/types"

/** Numbered steps (the order carries meaning) with a champagne hairline that draws as you read. */
export function Process({
  heading,
  intro,
  steps,
  id = "process-heading",
}: {
  heading: string
  intro: string
  steps: ProcessStep[]
  id?: string
}) {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.fromTo(
        "[data-line]",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: "[data-steps]", start: "top 70%", end: "bottom 60%", scrub: 0.6 },
        }
      )
      gsap.utils.toArray<HTMLElement>("[data-step]").forEach((step) => {
        gsap.from(step.querySelector("[data-dot]"), {
          scale: 0,
          duration: 0.8,
          ease: "back.out(2)",
          scrollTrigger: { trigger: step, start: "top 68%", once: true },
        })
      })
    },
    { scope: root }
  )

  return (
    <section ref={root} aria-labelledby={id} className="section-pad">
      <div className="container-editorial grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <Reveal as="h2" variant="lines" id={id} className="display-2 max-w-[12ch]">
              {heading}
            </Reveal>
            <Reveal>
              <p className="lede mt-6 max-w-[36ch]">{intro}</p>
            </Reveal>
          </div>
        </div>

        <ol data-steps className="relative lg:col-span-7 lg:col-start-6">
          <span aria-hidden className="absolute top-2 bottom-2 left-[0.3125rem] w-px bg-hairline" />
          <span aria-hidden data-line className="absolute top-2 bottom-2 left-[0.3125rem] w-px origin-top bg-accent-line" />
          {steps.map((step, i) => (
            <li key={step.title} data-step className="relative grid grid-cols-[auto_1fr] gap-x-8 pb-14 last:pb-0 md:gap-x-12 md:pb-20">
              <span data-dot aria-hidden className="relative mt-2.5 block size-[0.6875rem] rounded-full border border-accent-line bg-background" />
              <div>
                <p className="font-heading text-[1.05rem] text-ink-soft italic">Step {i + 1}</p>
                <h3 className="display-3 mt-2">{step.title}</h3>
                <p className="mt-4 max-w-[48ch] text-ink-soft">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
