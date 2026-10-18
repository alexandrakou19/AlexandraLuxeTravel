import Image from "next/image"

import type { Media } from "@/content/types"
import { cn } from "@workspace/ui/lib/utils"

/**
 * A photo that fills its frame. The frame (className) sets the aspect ratio or height.
 * Uses the focal point from the content model and a blurred placeholder.
 */
export function Photo({
  media,
  sizes,
  className,
  imgClassName,
  priority,
  quality = 80,
}: {
  media: Media
  sizes: string
  className?: string
  imgClassName?: string
  priority?: boolean
  quality?: 70 | 80 | 90
}) {
  return (
    <div className={cn("relative overflow-hidden bg-surface", className)}>
      <Image
        src={media.src}
        alt={media.alt}
        fill
        sizes={sizes}
        preload={priority}
        quality={quality}
        placeholder={media.blur ? "blur" : "empty"}
        blurDataURL={media.blur}
        className={cn("object-cover", imgClassName)}
        style={{ objectPosition: media.focal ?? "50% 50%" }}
      />
    </div>
  )
}

/** Magazine-style credit line under a photo. */
export function Caption({ media, className }: { media: Media; className?: string }) {
  if (!media.caption) return null
  return (
    <figcaption className={cn("mt-3 flex items-center gap-3 text-[0.8rem] tracking-[0.04em] text-ink-soft", className)}>
      <span aria-hidden className="h-px w-6 bg-accent-line" />
      <span>{media.caption}</span>
    </figcaption>
  )
}
