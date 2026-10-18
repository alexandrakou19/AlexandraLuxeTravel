import type { GlobalConfig } from "payload"

import { anyone, loggedIn } from "../lib/access"
import { revalidateGlobal } from "../lib/revalidate"

export const PrivacyPolicy: GlobalConfig = {
  slug: "privacy-policy",
  label: "Privacy Policy",
  admin: { group: "Pages" },
  access: { read: anyone, update: loggedIn },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    { name: "intro", type: "textarea", required: true },
    { name: "content", type: "richText", required: true },
    { name: "lastUpdated", label: "Last updated", type: "text", required: true, admin: { description: "e.g. October 2026" } },
  ],
}
