"use client"

import { ArrowLeft, ArrowRight } from "@phosphor-icons/react"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"

import type { Testimonial } from "@/content/types"
import { cn } from "@workspace/ui/lib/utils"

const DURATION = 9000

/** One large quote at a time, cross-fading, with a hairline that fills until the next. */
export function TestimonialCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  // Read after mount so server and client render the same markup.
  const [reduce, setReduce] = useState(false)
  useEffect(() => setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches), [])
  const count = testimonials.length
  const go = useCallback((dir: number) => setIndex((i) => (i + dir + count) % count), [count])

  useEffect(() => {
    if (paused || reduce || count < 2) return
    const id = window.setTimeout(() => go(1), DURATION)
    return () => window.clearTimeout(id)
  }, [index, paused, reduce, go, count])

  if (!count) return null
  const playing = !paused && !reduce && count > 1

  return (
    <section
      aria-labelledby="testimonials-heading"
      aria-roledescription="carousel"
      className="section-pad bg-surface"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="container-editorial grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="flex flex-col justify-between gap-8 lg:col-span-3">
          <div>
            <h2 id="testimonials-heading" className="eyebrow">
              Kind words
            </h2>
            <svg aria-hidden viewBox="0 0 64 48" className="mt-8 h-12 w-16 text-accent-line">
              <path
                fill="currentColor"
                d="M0 48V28.8C0 12.6 8.4 2.9 25.2 0l2.4 5.6C19 8 14.6 13.1 14.2 21H26v27H0Zm36 0V28.8C36 12.6 44.4 2.9 61.2 0l2.4 5.6C55 8 50.6 13.1 50.2 21H62v27H36Z"
              />
            </svg>
          </div>
          {count > 1 ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous testimonial"
                className="inline-flex size-12 items-center justify-center rounded-full border border-foreground/30 transition-colors duration-300 hover:bg-foreground hover:text-background"
              >
                <ArrowLeft weight="light" className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next testimonial"
                className="inline-flex size-12 items-center justify-center rounded-full border border-foreground/30 transition-colors duration-300 hover:bg-foreground hover:text-background"
              >
                <ArrowRight weight="light" className="size-4" />
              </button>
              <p className="ml-4 text-[0.85rem] text-ink-soft tabular-nums" aria-hidden>
                {index + 1} / {count}
              </p>
            </div>
          ) : null}
        </div>

        <div className="lg:col-span-8 lg:col-start-5">
          <div aria-live={paused ? "polite" : "off"} className="grid min-h-[22rem] md:min-h-[19rem]">
            {/* All quotes share one grid cell and cross-fade (CSS only). */}
            {testimonials.map((item, i) => (
              <figure
                key={item.id}
                aria-hidden={i !== index}
                className={cn(
                  "[grid-area:1/1] transition-[opacity,transform,filter] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
                  i === index ? "translate-y-0 opacity-100 blur-0 delay-200" : "pointer-events-none translate-y-4 opacity-0 blur-[6px]"
                )}
              >
                <blockquote className="font-heading text-[clamp(1.5rem,1.15rem+1.4vw,2.4rem)] leading-[1.3]">
                  “{item.quote}”
                </blockquote>
                <figcaption className="mt-8 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span className="text-[0.8rem] font-medium tracking-[0.18em] uppercase">{item.clientName}</span>
                  <span className="text-[0.9rem] text-ink-soft italic">{item.trip}</span>
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="mt-10 flex gap-2" aria-hidden>
            {testimonials.map((item, i) => (
              <span key={item.id} className="relative h-px flex-1 overflow-hidden bg-foreground/15">
                <span
                  key={`${index}-${paused}`}
                  className="absolute inset-0 origin-left bg-foreground"
                  style={
                    i < index
                      ? { transform: "scaleX(1)" }
                      : i > index
                        ? { transform: "scaleX(0)" }
                        : playing
                          ? { animation: `progress ${DURATION}ms linear forwards` }
                          : { transform: "scaleX(1)" }
                  }
                />
              </span>
            ))}
          </div>

          <Link href="/testimonials" className="link-draw mt-8 inline-block text-[0.8rem] font-medium tracking-[0.18em] uppercase">
            Read all reviews
          </Link>
        </div>
      </div>
    </section>
  )
}
