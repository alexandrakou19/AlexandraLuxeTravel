"use client"

import { ArrowRight } from "@phosphor-icons/react"
import Link from "next/link"
import type { ComponentProps } from "react"

import { Magnetic } from "@/components/motion/magnetic"
import { track } from "@/lib/analytics"
import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

type Variant = NonNullable<Parameters<typeof buttonVariants>[0]>["variant"]
type Size = NonNullable<Parameters<typeof buttonVariants>[0]>["size"]

/** Every Inquire / Start Planning button: magnetic on desktop, tracked as click_inquire. */
export function InquireLink({
  href = "/inquire",
  location,
  children = "Start planning",
  variant = "default",
  size = "default",
  arrow = true,
  magnetic = true,
  className,
  ...rest
}: Omit<ComponentProps<typeof Link>, "href"> & {
  href?: string
  location: string
  variant?: Variant
  size?: Size
  arrow?: boolean
  magnetic?: boolean
}) {
  const link = (
    <Link
      href={href}
      onClick={() => track("click_inquire", { location })}
      className={cn(buttonVariants({ variant, size }), className)}
      {...rest}
    >
      <span>{children}</span>
      {arrow ? (
        <ArrowRight
          weight="light"
          aria-hidden
          className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/button:translate-x-1"
        />
      ) : null}
    </Link>
  )
  return magnetic ? <Magnetic>{link}</Magnetic> : link
}
