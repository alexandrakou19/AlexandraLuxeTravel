import Image from "next/image"
import Link from "next/link"

import { brand } from "@/content/media"
import { cn } from "@workspace/ui/lib/utils"

const logo = brand("logo-full")
const light = brand("logo-light")

/**
 * The client's own wordmark: the original on light surfaces, her reversed (ivory) version on
 * dark ones (dark theme, charcoal footer, over photos). Both stay mounted so the header can
 * switch tone on scroll without a flash.
 */
export function Logo({
  tone = "auto",
  className,
  priority,
}: {
  /** auto: original on light, reversed in dark theme. light: always reversed. */
  tone?: "auto" | "light"
  className?: string
  priority?: boolean
}) {
  const loading = priority ? "eager" : undefined
  return (
    <Link
      href="/"
      aria-label="Alexandra Luxe Travel, home"
      className={cn("relative block shrink-0", className)}
      style={{ aspectRatio: `${logo.width} / ${logo.height}` }}
    >
      <Image
        src={logo.src}
        alt=""
        fill
        loading={loading}
        sizes="220px"
        className={cn("object-contain object-left", tone === "auto" ? "dark:hidden" : "hidden")}
      />
      <Image
        src={light.src}
        alt=""
        fill
        loading={loading}
        sizes="220px"
        className={cn("object-contain object-left", tone === "auto" ? "hidden dark:block" : "block")}
      />
    </Link>
  )
}
