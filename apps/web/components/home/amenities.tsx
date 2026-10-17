import { Reveal } from "@/components/motion/reveal"

function Ornament() {
  return (
    <svg aria-hidden viewBox="0 0 10 10" className="size-2.5 shrink-0 text-champagne">
      <path d="M5 0 L6.2 3.8 L10 5 L6.2 6.2 L5 10 L3.8 6.2 L0 5 L3.8 3.8 Z" fill="currentColor" />
    </svg>
  )
}

/** The perks of booking with Alexandra, as a slow marquee, plus the planning-fee note. */
export function Amenities({ amenities, planningFeeLine }: { amenities: string[]; planningFeeLine: string }) {
  const row = (hidden?: boolean) => (
    <ul aria-hidden={hidden} className="flex shrink-0 items-center gap-10 pr-10">
      {amenities.map((a) => (
        <li key={a} className="flex items-center gap-10 whitespace-nowrap">
          <span className="font-heading text-[clamp(1.6rem,1.2rem+1.6vw,2.6rem)] italic">{a}</span>
          <Ornament />
        </li>
      ))}
    </ul>
  )

  return (
    <section aria-labelledby="amenities-heading" className="relative overflow-hidden bg-band py-20 text-band-foreground lg:py-28">
      <div className="container-editorial grid gap-6 lg:grid-cols-12 lg:items-end">
        <h2 id="amenities-heading" className="eyebrow text-band-soft! lg:col-span-4">
          When you book with me
        </h2>
        <Reveal className="lg:col-span-7 lg:col-start-6">
          <p className="font-heading text-[clamp(1.5rem,1.2rem+1.1vw,2.125rem)] leading-snug">{planningFeeLine}</p>
        </Reveal>
      </div>

      <div className="group mt-14 flex w-max animate-marquee hover:[animation-play-state:paused] motion-reduce:animate-none lg:mt-20">
        {row()}
        {row(true)}
      </div>
      <p className="sr-only">Benefits include: {amenities.join(", ")}.</p>
    </section>
  )
}
