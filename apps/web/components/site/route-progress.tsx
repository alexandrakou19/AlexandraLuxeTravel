"use client"

import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"

import { ROUTE_START_EVENT } from "@/lib/route-events"

type Phase = "idle" | "loading" | "done"

/** Show the line only when a navigation is slow enough to notice; prefetched pages stay instant. */
const SHOW_AFTER_MS = 120
/** Never leave a line hanging if a navigation is abandoned. */
const GIVE_UP_MS = 12_000
/** Long enough for the line to finish drawing and sweep out (globals.css). */
const DONE_MS = 900

/**
 * A champagne hairline drawn across the top of the window while the next page loads, with a
 * brighter nib at its leading edge. It completes, then lifts away to the right.
 */
export function RouteProgress() {
  const pathname = usePathname()
  const [phase, setPhase] = useState<Phase>("idle")
  const timers = useRef<number[]>([])

  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t))
    timers.current = []
  }

  useEffect(() => {
    const start = () => {
      clear()
      timers.current.push(
        window.setTimeout(() => setPhase("loading"), SHOW_AFTER_MS),
        window.setTimeout(() => setPhase("idle"), GIVE_UP_MS)
      )
    }
    window.addEventListener(ROUTE_START_EVENT, start)
    return () => {
      window.removeEventListener(ROUTE_START_EVENT, start)
      clear()
    }
  }, [])

  // The new route has rendered: finish the line (if it ever showed), then let it sweep out.
  useEffect(() => {
    clear()
    setPhase((p) => (p === "loading" ? "done" : "idle"))
    timers.current.push(window.setTimeout(() => setPhase("idle"), DONE_MS))
  }, [pathname])

  return (
    <div aria-hidden data-phase={phase} className="route-progress">
      <span className="route-progress__nib" />
    </div>
  )
}
