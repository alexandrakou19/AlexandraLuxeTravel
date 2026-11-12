"use client"

import { useEffect, useState } from "react"

const STORAGE_KEY = "alt-cookie-notice"

/**
 * Small dismissible cookie notice shown once per visitor. Rendered only on
 * public pages; remembers dismissal in localStorage.
 */
export function CookieNotice() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true)
  }, [])

  if (!visible) return null

  return (
    <div className="bg-band text-band-foreground fixed inset-x-0 bottom-0 z-50">
      <div className="container-editorial text-band-soft flex flex-col items-start gap-3 py-4 text-[0.8rem] sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-[60ch]">This site uses cookies for analytics, to understand how visitors use it.</p>
        <button
          type="button"
          onClick={() => {
            localStorage.setItem(STORAGE_KEY, "dismissed")
            setVisible(false)
          }}
          className="link-draw font-heading shrink-0 tracking-wide uppercase"
        >
          Got it
        </button>
      </div>
    </div>
  )
}
