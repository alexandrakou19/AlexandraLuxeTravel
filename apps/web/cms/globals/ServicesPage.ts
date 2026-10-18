import type { GlobalConfig } from "payload"

import { anyone, loggedIn } from "../lib/access"
import { steps, textList } from "../lib/fields"
import { revalidateGlobal } from "../lib/revalidate"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

export const ServicesPage: GlobalConfig = {
  slug: "services-page",
  label: "Services page",
  admin: {
    group: "Pages",
    livePreview: { url: `${siteUrl}/next/preview?path=/services` },
    preview: () => `${siteUrl}/next/preview?path=/services`,
  },
  access: { read: anyone, update: loggedIn },
  versions: { drafts: { autosave: { interval: 800 } }, max: 25 },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    { name: "intro", type: "textarea", required: true },
    { name: "styles", label: "Travel styles & budgets note", type: "textarea", required: true },
    { name: "planningFee", label: "Planning fee line", type: "text", required: true },
    textList("amenities", "Perks of booking with me", "Perk"),
    { name: "processIntro", label: "Process intro", type: "text", required: true },
    steps("processSteps", "My planning process"),
  ],
}
