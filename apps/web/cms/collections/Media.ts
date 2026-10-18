import sharp from "sharp"
import type { CollectionConfig } from "payload"

import { anyone, loggedIn } from "../lib/access"
import { revalidateAfterChange, revalidateAfterDelete } from "../lib/revalidate"

export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "Photo", plural: "Photos" },
  admin: {
    group: "Content",
    defaultColumns: ["filename", "alt", "caption", "updatedAt"],
    description: "Every photo on the website. Click a photo to change its description, caption or focal point.",
  },
  access: { read: anyone, create: loggedIn, update: loggedIn, delete: loggedIn },
  upload: {
    staticDir: "media",
    mimeTypes: ["image/*"],
    focalPoint: true,
    crop: true,
  },
  hooks: {
    // A tiny blurred preview shown while the full photo loads.
    beforeChange: [
      async ({ data, req }) => {
        const file = req.file
        if (file?.data && file.mimetype?.startsWith("image/")) {
          try {
            const buf = await sharp(file.data).rotate().resize(16, 16, { fit: "inside" }).jpeg({ quality: 50 }).toBuffer()
            data.blurDataURL = `data:image/jpeg;base64,${buf.toString("base64")}`
          } catch {
            // Not fatal: the photo still works without a placeholder.
          }
        }
        return data
      },
    ],
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
  fields: [
    {
      name: "alt",
      label: "Photo description",
      type: "text",
      required: true,
      admin: { description: "Describe what is in the photo for people using screen readers and for Google. Example: “Alexandra in a red dress at Karnak Temple”." },
    },
    {
      name: "caption",
      type: "text",
      admin: { description: "Short location credit shown under the photo, e.g. “Karnak Temple, Luxor — Egypt”." },
    },
    {
      name: "isStock",
      label: "This is a stock photo (not from my travels)",
      type: "checkbox",
      defaultValue: false,
    },
    {
      name: "credit",
      label: "Stock photo source link",
      type: "text",
      admin: { condition: (_, siblingData) => Boolean(siblingData?.isStock), description: "Where the stock photo came from (Unsplash/Pexels link)." },
    },
    { name: "blurDataURL", type: "text", admin: { hidden: true } },
  ],
}
