"use client"

import { FacebookLogo, InstagramLogo, PinterestLogo, TiktokLogo } from "@phosphor-icons/react"

import type { SocialLink } from "@/content/types"
import { track } from "@/lib/analytics"
import { cn } from "@workspace/ui/lib/utils"

const icons = {
  instagram: InstagramLogo,
  facebook: FacebookLogo,
  pinterest: PinterestLogo,
  tiktok: TiktokLogo,
}

export function SocialLinks({ links, className }: { links: SocialLink[]; className?: string }) {
  return (
    <ul className={cn("flex items-center gap-1", className)}>
      {links.map((link) => {
        const Icon = icons[link.network]
        return (
          <li key={link.network}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${link.label} (opens in a new tab)`}
              onClick={() => track("click_social", { network: link.network })}
              className="inline-flex size-11 items-center justify-center rounded-full transition-colors duration-300 hover:bg-current/10"
            >
              <Icon weight="light" className="size-5" />
            </a>
          </li>
        )
      })}
    </ul>
  )
}
