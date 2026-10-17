"use client"

import { useEffect } from "react"

import { track } from "@/lib/analytics"

/** Fires the GA4 key event once, only after a real submission (not on refresh or direct visits). */
export function LeadTracker() {
  useEffect(() => {
    try {
      if (!sessionStorage.getItem("inquiry-first-name")) return
      sessionStorage.removeItem("inquiry-first-name")
    } catch {
      return
    }
    track("generate_lead")
  }, [])
  return null
}
