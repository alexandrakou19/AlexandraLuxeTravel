import Image from "next/image"

import { Reveal } from "@/components/motion/reveal"
import type { Credential } from "@/content/types"

/** Affiliations the client provided. Renders nothing when empty. */
export function Credentials({ credentials, className }: { credentials: Credential[]; className?: string }) {
  if (!credentials.length) return null
  return (
    <section aria-labelledby="credentials-heading" className={className ?? "border-y border-hairline py-14 lg:py-16"}>
      <div className="container-editorial grid gap-10 lg:grid-cols-12 lg:items-center">
        <h2 id="credentials-heading" className="eyebrow lg:col-span-3">
          Affiliations & certifications
        </h2>
        <Reveal as="ul" variant="stagger" className="flex flex-wrap items-center gap-x-12 gap-y-8 lg:col-span-9 lg:justify-end">
          {credentials.map((c) => (
            <li key={c.id} data-reveal-item>
              {c.logo ? (
                <Image
                  src={c.logo.src}
                  alt={c.name}
                  width={c.logo.width}
                  height={c.logo.height}
                  sizes="180px"
                  className="h-12 w-auto object-contain opacity-75 grayscale transition-[filter,opacity] duration-700 hover:opacity-100 hover:grayscale-0 md:h-14 dark:opacity-80 dark:invert dark:hover:invert-0"
                />
              ) : (
                <span className="font-heading text-[1.35rem] leading-tight italic">{c.name}</span>
              )}
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
