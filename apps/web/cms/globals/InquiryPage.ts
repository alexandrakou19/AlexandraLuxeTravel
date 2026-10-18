import type { GlobalConfig } from "payload"

import { anyone, loggedIn } from "../lib/access"
import { steps } from "../lib/fields"
import { revalidateGlobal } from "../lib/revalidate"

export const InquiryPage: GlobalConfig = {
  slug: "inquiry-page",
  label: "Inquiry form & thank-you",
  admin: { group: "Pages" },
  access: { read: anyone, update: loggedIn },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    { name: "intro", label: "Text above the form", type: "textarea", required: true },
    {
      name: "budgetRanges",
      label: "Budget options",
      type: "array",
      labels: { singular: "Option", plural: "Options" },
      minRows: 1,
      fields: [{ name: "label", type: "text", required: true }],
    },
    {
      type: "group",
      name: "thankYou",
      label: "Thank-you page",
      fields: [
        { name: "heading", type: "text", required: true },
        { name: "body", type: "textarea", required: true },
        steps("nextSteps", "What happens next"),
      ],
    },
  ],
}
