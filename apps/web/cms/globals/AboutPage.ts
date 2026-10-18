import type { GlobalConfig } from "payload"

import { anyone, loggedIn } from "../lib/access"
import { paragraphs, photo } from "../lib/fields"
import { revalidateGlobal } from "../lib/revalidate"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

export const AboutPage: GlobalConfig = {
  slug: "about-page",
  label: "About Me page",
  admin: {
    group: "Pages",
    livePreview: { url: `${siteUrl}/next/preview?path=/about` },
    preview: () => `${siteUrl}/next/preview?path=/about`,
  },
  access: { read: anyone, update: loggedIn },
  versions: { drafts: { autosave: { interval: 800 } }, max: 25 },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    photo("portrait", "Portrait"),
    { name: "headline", type: "text", required: true },
    { name: "intro", type: "textarea", required: true },
    paragraphs("story", "My story"),
    {
      type: "group",
      name: "family",
      label: "The family angle",
      fields: [
        { name: "heading", type: "text", required: true },
        paragraphs("body", "Text"),
        { type: "row", fields: [photo("image", "Main photo"), photo("image2", "Smaller photo", false)] },
      ],
    },
    {
      name: "philosophy",
      label: "What working with me is like",
      type: "array",
      maxRows: 3,
      labels: { singular: "Point", plural: "Points" },
      fields: [
        { name: "title", type: "text", required: true },
        { name: "body", type: "textarea", required: true },
      ],
    },
    { name: "gallery", label: "Photo gallery", type: "upload", relationTo: "media", hasMany: true },
  ],
}
