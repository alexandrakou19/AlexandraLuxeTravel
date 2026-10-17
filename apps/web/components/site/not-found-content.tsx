import Link from "next/link"

import { Photo } from "@/components/editorial/photo"
import { InquireLink } from "@/components/site/inquire-link"
import { photo } from "@/content/media"
import { buttonVariants } from "@workspace/ui/components/button"

export function NotFoundContent() {
  return (
    <section className="container-editorial pt-32 pb-24 lg:pt-40 lg:pb-32">
      <div className="grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-10">
        <div className="lg:col-span-6">
          <p className="eyebrow rise-in">Page not found</p>
          <h1 className="display-1 rise-in mt-5 [animation-delay:80ms]">
            Even the best travelers take a <em className="italic">wrong turn</em>
          </h1>
          <p className="lede rise-in mt-6 max-w-[42ch] [animation-delay:180ms]">
            The page you were looking for has moved or no longer exists. Let’s get you back on the road.
          </p>
          <div className="rise-in mt-10 flex flex-wrap gap-3 [animation-delay:260ms]">
            <Link href="/" className={buttonVariants({ variant: "outline" })}>
              Home
            </Link>
            <Link href="/destinations" className={buttonVariants({ variant: "outline" })}>
              Destinations
            </Link>
            <InquireLink location="404" magnetic={false}>
              Inquire
            </InquireLink>
          </div>
        </div>
        <div className="rise-in lg:col-span-5 lg:col-start-8 [animation-delay:150ms]">
          <Photo media={photo("london-portrait")} sizes="(min-width: 1024px) 40vw, 100vw" className="aspect-[4/5]" />
        </div>
      </div>
    </section>
  )
}
