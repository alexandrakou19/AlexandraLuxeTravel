import Image from "next/image"
import Link from "next/link"
import { preload } from "react-dom"

import { brand } from "@/content/media"
import { cn } from "@workspace/ui/lib/utils"

const logo = brand("logo-full")
const mask = "/images/brand/logo-mask.webp"

/**
 * The client's own wordmark. On dark surfaces (dark theme, charcoal footer, over photos)
 * it renders as an ivory silhouette until a reversed logo file is supplied.
 */
export function Logo({
  tone = "auto",
  className,
  priority,
}: {
  /** auto: original on light, ivory in dark theme. light: always ivory. */
  tone?: "auto" | "light"
  className?: string
  priority?: boolean
}) {
  const ratio = `${logo.width} / ${logo.height}`
  preload(mask, { as: "image", type: "image/webp" })
  return (
    <Link href="/" aria-label="Alexandra Luxe Travel, home" className={cn("relative block shrink-0", className)} style={{ aspectRatio: ratio }}>
      {tone === "auto" ? (
        <Image
          src={logo.src}
          alt=""
          fill
          loading={priority ? "eager" : undefined}
          fetchPriority={priority ? "high" : undefined}
          sizes="200px"
          className="object-contain object-left dark:hidden"
        />
      ) : null}
      <span
        aria-hidden
        className={cn("logo-ivory absolute inset-0", tone === "auto" ? "hidden dark:block" : "block")}
        style={{ maskImage: `url(${mask})`, WebkitMaskImage: `url(${mask})` }}
      />
    </Link>
  )
}
