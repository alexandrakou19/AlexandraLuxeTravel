"use client"

import { RefreshRouteOnSave } from "@payloadcms/live-preview-react"
import { usePathname, useRouter } from "next/navigation"

/** Shown only in draft mode: refreshes on every CMS save and offers a way out of preview. */
export function LivePreview() {
  const router = useRouter()
  const pathname = usePathname()
  const serverURL = typeof window !== "undefined" ? window.location.origin : ""
  return (
    <>
      <RefreshRouteOnSave refresh={() => router.refresh()} serverURL={serverURL} />
      <div className="fixed bottom-4 left-1/2 z-[70] flex -translate-x-1/2 items-center gap-4 rounded-full bg-charcoal px-5 py-2.5 text-[0.8rem] text-ivory shadow-[0_10px_30px_-10px_rgb(30_26_23/0.5)]">
        <span>Preview: showing unpublished changes</span>
        <a href={`/next/exit-preview?path=${encodeURIComponent(pathname)}`} className="underline underline-offset-4">
          Exit
        </a>
      </div>
    </>
  )
}
