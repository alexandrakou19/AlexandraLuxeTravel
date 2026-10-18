import type { GlobalConfig } from "payload"

import { anyone, loggedIn } from "../lib/access"
import { photo } from "../lib/fields"
import { revalidateGlobal } from "../lib/revalidate"

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Site Settings",
  admin: { group: "Settings" },
  access: { read: anyone, update: loggedIn },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Contact & social",
          fields: [
            { name: "tagline", type: "text", required: true },
            { name: "email", label: "Public email address", type: "email", required: true },
            {
              name: "social",
              label: "Social links",
              type: "array",
              labels: { singular: "Link", plural: "Links" },
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "network",
                      type: "select",
                      required: true,
                      options: [
                        { label: "Instagram", value: "instagram" },
                        { label: "Facebook", value: "facebook" },
                        { label: "Pinterest", value: "pinterest" },
                        { label: "TikTok", value: "tiktok" },
                      ],
                    },
                    { name: "handle", type: "text", admin: { description: "Optional, e.g. @alexandraluxetravel19" } },
                  ],
                },
                { name: "url", label: "Link", type: "text", required: true },
              ],
            },
          ],
        },
        {
          label: "Inquiries",
          fields: [
            {
              name: "notificationEmail",
              label: "Send new inquiries to",
              type: "email",
              required: true,
              admin: { description: "The inbox that receives every new inquiry and contact message." },
            },
            {
              name: "replyTimePromise",
              label: "When will you reply?",
              type: "text",
              required: true,
              admin: { description: "Completes the sentence “You’ll hear from me …”, e.g. “within one business day”." },
            },
          ],
        },
        {
          label: "Credentials & reviews",
          fields: [
            {
              name: "credentials",
              label: "Credentials & affiliations",
              type: "array",
              labels: { singular: "Credential", plural: "Credentials" },
              admin: { description: "Leave empty to hide the credentials strip." },
              fields: [
                { name: "name", type: "text", required: true },
                photo("logo", "Logo (optional)", false),
              ],
            },
            {
              name: "testimonialsEnabled",
              label: "Show testimonials on the website",
              type: "checkbox",
              defaultValue: true,
            },
          ],
        },
        {
          label: "Sharing",
          fields: [photo("defaultSeoImage", "Default image when the site is shared")],
        },
      ],
    },
  ],
}
