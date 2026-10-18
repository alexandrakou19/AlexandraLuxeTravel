/**
 * One-off: after BLOB_READ_WRITE_TOKEN is set, re-upload photos that were seeded to
 * local disk (apps/web/media) so they are served from Vercel Blob in production.
 * Records keep their ids, so every page keeps pointing at the same photo.
 *
 *   BLOB_READ_WRITE_TOKEN=... bun run payload run scripts/upload-media-to-blob.ts
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

import config from "@payload-config"
import { getPayload } from "payload"

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error("Set BLOB_READ_WRITE_TOKEN first.")
  process.exit(1)
}

const localDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../media")
const payload = await getPayload({ config })
const { docs } = await payload.find({ collection: "media", limit: 500, depth: 0 })

for (const doc of docs) {
  const file = doc.filename ? path.join(localDir, doc.filename) : ""
  if (!file || !fs.existsSync(file)) {
    payload.logger.warn(`skipped ${doc.filename}: no local file`)
    continue
  }
  await payload.update({ collection: "media", id: doc.id, data: {}, filePath: file, context: { disableRevalidate: true } })
  payload.logger.info(`uploaded ${doc.filename}`)
}
process.exit(0)
