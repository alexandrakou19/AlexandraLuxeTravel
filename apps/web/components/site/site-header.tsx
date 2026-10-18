"use client"

import { List, X } from "@phosphor-icons/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"

import { useLenis } from "@/components/motion/smooth-scroll"
import type { NavItem, SocialLink } from "@/content/types"
import { cn } from "@workspace/ui/lib/utils"

import { InquireLink } from "./inquire-link"
import { Logo } from "./logo"
import { SocialLinks } from "./social-links"
import { ThemeToggle } from "./theme-toggle"

export function SiteHeader({
  nav,
  cta,
  social,
  email,
}: {
  nav: NavItem[]
  cta: NavItem
  social: SocialLink[]
  email: string
}) {
  const pathname = usePathname()
  const lenis = useLenis()
  const [scrolled, setScrolled] = useState(false)
  const [overHero, setOverHero] = useState(false)
  const [open, setOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)
  const firstLink = useRef<HTMLAnchorElement>(null)

  // Pages with a full-bleed photo hero mark it with [data-hero-overlay]; the header starts transparent there.
  useEffect(() => {
    setOverHero(Boolean(document.querySelector("[data-hero-overlay]")))
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    lenis?.stop()
    document.documentElement.style.overflow = "hidden"
    firstLink.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => {
      lenis?.start()
      document.documentElement.style.overflow = ""
      window.removeEventListener("keydown", onKey)
      menuButton.current?.focus()
    }
  }, [open, lenis])

  const transparent = overHero && !scrolled && !open

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[60] bg-primary px-4 py-3 text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <header
        style={{ viewTransitionName: "site-header" }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,color,border-color,height] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
          "border-b",
          transparent
            ? "h-20 border-transparent bg-transparent text-ivory lg:h-24"
            : "h-16 border-hairline bg-background text-foreground lg:h-[4.5rem]"
        )}
      >
        {/* A soft scrim keeps the ivory logo and links legible over any photo. */}
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-espresso/55 to-transparent transition-opacity duration-700",
            transparent ? "opacity-100" : "opacity-0"
          )}
        />
        <div className="container-editorial relative flex h-full items-center justify-between gap-6 lg:grid lg:grid-cols-[1fr_auto_1fr]">
          <Logo
            tone={transparent ? "light" : "auto"}
            priority
            className={cn("transition-[width] duration-700", transparent ? "w-36 lg:w-44" : "w-32 lg:w-36")}
          />

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {nav.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className="link-draw text-[0.8rem] font-medium tracking-[0.16em] uppercase"
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="flex items-center justify-end gap-1 sm:gap-2">
            <ThemeToggle className="hidden lg:inline-flex" />
            <InquireLink
              href={cta.href}
              location="header"
              size="sm"
              arrow={false}
              variant={transparent ? "inverse" : "default"}
              className="px-4 sm:px-5"
            >
              {cta.label}
            </InquireLink>
            <button
              ref={menuButton}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="-mr-2 inline-flex size-11 items-center justify-center lg:hidden"
            >
              {open ? <X weight="light" className="size-6" /> : <List weight="light" className="size-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu: always mounted, opened with a clip-path curtain (CSS only, no animation library). */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!open}
        data-open={open}
        data-lenis-prevent
        className={cn(
          "fixed inset-0 z-40 flex flex-col bg-background px-5 pt-24 pb-8 lg:hidden",
          "transition-[clip-path,visibility] duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
          open ? "visible [clip-path:inset(0_0_0%_0)]" : "invisible [clip-path:inset(0_0_100%_0)]"
        )}
      >
        <nav aria-label="Mobile" className="flex-1">
          <ul className="flex flex-col gap-1">
            {[{ label: "Home", href: "/" }, ...nav].map((item, i) => (
              <li
                key={item.href}
                className={cn(
                  "transition-[transform,opacity] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
                  open ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                )}
                style={{ transitionDelay: open ? `${150 + i * 60}ms` : "0ms" }}
              >
                <Link
                  ref={i === 0 ? firstLink : undefined}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="font-heading block py-1.5 text-[2.6rem] leading-tight aria-[current=page]:italic"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div
          className={cn("flex flex-col gap-5 border-t border-hairline pt-6 transition-opacity duration-700", open ? "opacity-100 delay-500" : "opacity-0")}
        >
          <a href={`mailto:${email}`} className="text-ink-soft break-all text-[0.95rem]">
            {email}
          </a>
          <div className="flex items-center justify-between">
            <SocialLinks links={social} className="-ml-3" />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </>
  )
}
