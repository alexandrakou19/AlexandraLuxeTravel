import type { GlobalConfig } from "payload"

import { anyone, loggedIn } from "../lib/access"
import { revalidateGlobal } from "../lib/revalidate"

export const ContactPage: GlobalConfig = {
  slug: "contact-page",
  label: "Contact page",
  admin: { group: "Pages" },
  access: { read: anyone, update: loggedIn },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    { name: "intro", type: "textarea", required: true },
    { name: "panelHeading", label: "Inquiry panel heading", type: "text", required: true },
    { name: "panelBody", label: "Inquiry panel text", type: "textarea", required: true },
  ],
}
