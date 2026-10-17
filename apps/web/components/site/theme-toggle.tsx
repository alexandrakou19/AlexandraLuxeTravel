"use client"

import { Moon, Sun } from "@phosphor-icons/react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

import { cn } from "@workspace/ui/lib/utils"

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const dark = mounted && resolvedTheme === "dark"

  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      className={cn(
        "relative inline-flex size-11 items-center justify-center rounded-full text-current transition-colors duration-300 hover:bg-current/8",
        className
      )}
    >
      <Sun weight="light" className={cn("absolute size-[1.15rem] transition-all duration-500", dark ? "scale-100 rotate-0 opacity-100" : "scale-50 -rotate-90 opacity-0")} />
      <Moon weight="light" className={cn("absolute size-[1.15rem] transition-all duration-500", dark ? "scale-50 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100")} />
    </button>
  )
}
