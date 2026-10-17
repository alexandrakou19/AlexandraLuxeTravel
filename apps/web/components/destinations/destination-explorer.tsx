"use client"

import { AnimatePresence, motion } from "motion/react"
import { useEffect, useMemo, useState } from "react"

import type { Destination, ExperienceTag } from "@/content/types"
import { cn } from "@workspace/ui/lib/utils"

import { DestinationCard } from "./destination-card"

// Editorial rhythm: a few frames run taller or wider so the grid never reads as a template.
const rhythm = ["lg:col-span-7", "lg:col-span-5 lg:mt-24", "lg:col-span-5", "lg:col-span-7 lg:mt-24", "lg:col-span-6", "lg:col-span-6 lg:mt-16"]
const aspects = ["aspect-[4/3]", "aspect-[4/5]", "aspect-[4/5]", "aspect-[4/3]", "aspect-[5/6]", "aspect-[5/6]"]

/** Client-side filtering by experience; no reload, with a soft layout reflow. */
export function DestinationExplorer({
  destinations,
  filters,
}: {
  destinations: Destination[]
  filters: { tag: ExperienceTag; label: string }[]
}) {
  const [active, setActive] = useState<ExperienceTag | "all">("all")
  const [reduce, setReduce] = useState(false)
  useEffect(() => setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches), [])

  const visible = useMemo(
    () => (active === "all" ? destinations : destinations.filter((d) => d.tags.includes(active))),
    [active, destinations]
  )
  const chips: { tag: ExperienceTag | "all"; label: string }[] = [{ tag: "all", label: "All" }, ...filters]

  return (
    <div className="container-editorial pb-24 lg:pb-32">
      <div className="flex flex-col gap-5 border-y border-hairline py-5 md:flex-row md:items-center md:justify-between">
        <div role="group" aria-label="Filter destinations by experience" className="-mx-1 flex flex-wrap gap-2">
          {chips.map((c) => {
            const on = active === c.tag
            return (
              <button
                key={c.tag}
                type="button"
                aria-pressed={on}
                onClick={() => setActive(c.tag)}
                className={cn(
                  "h-11 rounded-full border px-5 text-[0.78rem] font-medium tracking-[0.14em] uppercase transition-colors duration-300",
                  on ? "border-foreground bg-foreground text-background" : "border-hairline hover:border-foreground"
                )}
              >
                {c.label}
              </button>
            )
          })}
        </div>
        <p aria-live="polite" className="text-[0.9rem] text-ink-soft tabular-nums">
          {visible.length} {visible.length === 1 ? "destination" : "destinations"}
        </p>
      </div>

      <motion.ul layout={!reduce} className="mt-12 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:mt-16 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-20">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((d, i) => (
            <motion.li
              key={d.slug}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className={cn(rhythm[i % rhythm.length])}
            >
              <DestinationCard destination={d} aspect={aspects[i % aspects.length]} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      {visible.length === 0 ? (
        <p className="mt-16 text-center text-ink-soft">
          No destinations match that yet.{" "}
          <button type="button" onClick={() => setActive("all")} className="underline underline-offset-4">
            Show all
          </button>
        </p>
      ) : null}
    </div>
  )
}
