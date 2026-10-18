import { revalidatePath } from "next/cache"
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from "payload"

/**
 * Every public page is statically generated. When Alexandra publishes a change we
 * revalidate the whole site (it is small), so edits go live within seconds without a redeploy.
 */
function revalidateSite(context: Record<string, unknown> | undefined) {
  if (context?.disableRevalidate) return
  try {
    revalidatePath("/", "layout")
  } catch {
    // Outside a Next.js request (e.g. the seed script): nothing to revalidate.
  }
}

export const revalidateAfterChange: CollectionAfterChangeHook = ({ doc, req }) => {
  // Draft autosaves don't change the live site.
  if ((doc as { _status?: string })._status !== "draft") revalidateSite(req.context)
  return doc
}

export const revalidateAfterDelete: CollectionAfterDeleteHook = ({ doc, req }) => {
  revalidateSite(req.context)
  return doc
}

export const revalidateGlobal: GlobalAfterChangeHook = ({ doc, req }) => {
  if ((doc as { _status?: string })._status !== "draft") revalidateSite(req.context)
  return doc
}
