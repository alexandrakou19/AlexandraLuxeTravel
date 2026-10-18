/* global Buffer, process */
// One-off asset pipeline: client folder -> optimized, privacy-safe files in /public.
// Usage (from apps/web): node scripts/prepare-assets.mjs
// - auto-orients and strips EXIF/GPS from every photo
// - caps the long edge at 2400px (next/image serves AVIF/WebP from these)
// - trims transparent padding off logos and badges
// - writes width/height + blur placeholders to content/media.generated.ts

import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import sharp from "sharp"

const here = path.dirname(fileURLToPath(import.meta.url))
const appRoot = path.resolve(here, "..")
const clientDir = path.resolve(appRoot, "../../docs/Webstire Designer File")
const pics = path.join(clientDir, "Website Pictures")
const out = path.join(appRoot, "public/images")

/** Her own photography. Keys become file names and media ids. */
const photos = {
  "karnak-red-dress": path.join(pics, "IMG_5614.jpg"),
  "london-portrait": path.join(pics, "IMG_5607.jpg"),
  "paris-family-seine": path.join(pics, "IMG_5615.jpg"),
  "paris-family-eiffel": path.join(pics, "IMG_5608.JPG"),
  "taipei-101": path.join(pics, "IMG_5613.jpg"),
  "milan-duomo-family": path.join(pics, "IMG_5624.jpg"),
  "canyon-family-hike": path.join(pics, "IMG_5611.jpg"),
  "resort-pool-daughter": path.join(pics, "IMG_5578.jpg"),
  "river-cruise-deck": path.join(pics, "IMG_5308.JPG"),
}

/** Free-license stock, only for places she has not photographed. */
const stock = {
  "stock-machu-picchu": "https://images.unsplash.com/photo-1526392060635-9d6019884377",
  "stock-caribbean-beach": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
  "stock-santorini-steps": "https://images.unsplash.com/photo-1533105079780-92b9be482077",
  "stock-santorini-oia": "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff",
  "stock-railay-longtails": "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a",
  "stock-prague-bridge": "https://images.unsplash.com/photo-1519677100203-a0e668c92439",
}

const brand = {
  "logo-full": path.join(clientDir, "Logos/39C0F9F3-5EDE-4C42-9A9B-D81FF2FA6598.PNG"),
  "logo-monogram": path.join(clientDir, "Logos/CA565AE1-0FA8-4EAD-AB14-72642B24EE0A.PNG"),
  "badge-sandals-elite": path.join(clientDir, "elite-advisor-blue.png"),
  "badge-travelmation-luxury": path.join(clientDir, "Luxury Badge.png"),
  "badge-travelmation-weddings": path.join(clientDir, "Destination Weddings Badge.png"),
  "badge-travelmation": path.join(clientDir, "TM Main Logo - White Columbia.png"),
}

async function blurOf(pipeline) {
  const buf = await pipeline.clone().resize(16, 16, { fit: "inside" }).jpeg({ quality: 50 }).toBuffer()
  return `data:image/jpeg;base64,${buf.toString("base64")}`
}

async function processPhoto(id, input) {
  const base = sharp(input).rotate() // honor EXIF orientation, metadata is dropped on output
  const resized = base.resize(2400, 2400, { fit: "inside", withoutEnlargement: true })
  const file = path.join(out, "photos", `${id}.jpg`)
  const info = await resized.clone().jpeg({ quality: 82, mozjpeg: true }).toFile(file)
  return { id, src: `/images/photos/${id}.jpg`, width: info.width, height: info.height, blur: await blurOf(resized) }
}

async function processBrand(id, input) {
  const file = path.join(out, "brand", `${id}.png`)
  const info = await sharp(input).trim({ threshold: 1 }).png({ compressionLevel: 9 }).toFile(file)
  return { id, src: `/images/brand/${id}.png`, width: info.width, height: info.height }
}

async function main() {
  await fs.mkdir(path.join(out, "photos"), { recursive: true })
  await fs.mkdir(path.join(out, "brand"), { recursive: true })

  const results = {}
  for (const [id, input] of Object.entries(photos)) {
    results[id] = await processPhoto(id, input)
    console.log("photo", id, results[id].width, "x", results[id].height)
  }
  for (const [id, url] of Object.entries(stock)) {
    const res = await fetch(`${url}?w=2400&q=90&fm=jpg`)
    if (!res.ok) throw new Error(`stock ${id}: ${res.status}`)
    results[id] = await processPhoto(id, Buffer.from(await res.arrayBuffer()))
    console.log("stock", id)
  }
  const brandResults = {}
  for (const [id, input] of Object.entries(brand)) {
    brandResults[id] = await processBrand(id, input)
    console.log("brand", id, brandResults[id].width, "x", brandResults[id].height)
  }

  // Email clients need a small, fixed-size logo.
  await sharp(path.join(out, "brand/logo-full.png")).resize({ width: 480 }).png({ compressionLevel: 9 }).toFile(path.join(out, "brand/logo-email.png"))

  // Small mask for the ivory logo silhouette (CSS mask-image bypasses next/image).
  await sharp(path.join(out, "brand/logo-full.png")).resize({ width: 520 }).webp({ quality: 80, alphaQuality: 90 }).toFile(path.join(out, "brand/logo-mask.webp"))

  // Favicon / app icon source: monogram on ivory, square.
  await sharp({ create: { width: 512, height: 512, channels: 4, background: "#F7F3EE" } })
    .composite([{ input: await sharp(brand["logo-monogram"]).trim({ threshold: 1 }).resize(420, 420, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer(), gravity: "center" }])
    .png()
    .toFile(path.join(appRoot, "app/icon.png"))
  const icon = await sharp(path.join(appRoot, "app/icon.png")).resize(192, 192).png({ palette: true, quality: 90 }).toBuffer()
  await fs.writeFile(path.join(appRoot, "app/icon.png"), icon)
  await sharp(icon).resize(180, 180).png({ palette: true, quality: 90 }).toFile(path.join(appRoot, "app/apple-icon.png"))

  const ts = `// Generated by scripts/prepare-assets.mjs. Do not edit by hand.\n\nexport const photoFiles = ${JSON.stringify(results, null, 2)} as const\n\nexport const brandFiles = ${JSON.stringify(brandResults, null, 2)} as const\n`
  await fs.writeFile(path.join(appRoot, "content/media.generated.ts"), ts)
  console.log("done")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
