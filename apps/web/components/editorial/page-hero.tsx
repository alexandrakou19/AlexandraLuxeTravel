import type { ReactNode } from "react"

import { cn } from "@workspace/ui/lib/utils"

/** Text-led page opener for inner pages. Animates with CSS so it never waits on JavaScript. */
export function PageHero({
  eyebrow,
  title,
  children,
  className,
  aside,
}: {
  eyebrow?: string
  title: ReactNode
  children?: ReactNode
  className?: string
  aside?: ReactNode
}) {
  return (
    <section className={cn("container-editorial pt-32 pb-14 lg:pt-44 lg:pb-20", className)}>
      <div className={cn("grid gap-10", aside && "lg:grid-cols-[1.25fr_1fr] lg:items-end lg:gap-20")}>
        <div>
          {eyebrow ? <p className="eyebrow rise-in">{eyebrow}</p> : null}
          <h1 className="display-1 rise-in mt-5 max-w-[18ch] [animation-delay:80ms]">{title}</h1>
        </div>
        {aside || children ? (
          <div className="lede rise-in max-w-[52ch] [animation-delay:200ms]">{aside ?? children}</div>
        ) : null}
      </div>
    </section>
  )
}
