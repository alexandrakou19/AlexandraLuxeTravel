import type { GlobalConfig } from "payload"

import { anyone, loggedIn } from "../lib/access"
import { paragraphs, photo } from "../lib/fields"
import { revalidateGlobal } from "../lib/revalidate"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

export const HomePage: GlobalConfig = {
  slug: "home-page",
  label: "Homepage",
  admin: {
    group: "Pages",
    livePreview: { url: `${siteUrl}/next/preview?path=/` },
    preview: () => `${siteUrl}/next/preview?path=/`,
  },
  access: { read: anyone, update: loggedIn },
  versions: { drafts: { autosave: { interval: 800 } }, max: 25 },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Top of page",
          fields: [
            photo("heroImage", "Homepage main photo"),
            {
              type: "row",
              fields: [
                { name: "heroHeadline", label: "Headline", type: "text", required: true },
                { name: "heroHeadlineAccent", label: "Headline (second line, in italics)", type: "text", required: true },
              ],
            },
            { name: "heroSubhead", label: "Line under the headline", type: "textarea", required: true },
          ],
        },
        {
          label: "Meet Alexandra",
          fields: [
            { name: "meetHeading", label: "Heading", type: "text", required: true },
            paragraphs("meetBody", "Text"),
            {
              type: "row",
              fields: [photo("meetPortrait", "Main portrait"), photo("meetSecondary", "Smaller overlapping photo")],
            },
            {
              name: "stats",
              label: "Numbers",
              type: "array",
              maxRows: 4,
              labels: { singular: "Number", plural: "Numbers" },
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "value", type: "number", required: true },
                    { name: "suffix", type: "text", admin: { description: "e.g. +" } },
                    { name: "label", type: "text", required: true },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Signature",
          fields: [
            { name: "signatureEyebrow", label: "Small label", type: "text", required: true },
            { name: "signatureHeading", label: "Heading", type: "text", required: true },
            paragraphs("signatureBody", "Text"),
            {
              type: "row",
              fields: [photo("signatureImage", "Main photo"), photo("signatureImage2", "Smaller photo")],
            },
          ],
        },
        {
          label: "Journeys",
          fields: [
            { name: "journeysHeading", label: "Heading", type: "text", required: true },
            { name: "journeysIntro", label: "Intro", type: "textarea", required: true },
            {
              name: "journeys",
              label: "Journey rows",
              type: "array",
              labels: { singular: "Journey", plural: "Journeys" },
              fields: [
                { name: "title", type: "text", required: true },
                { name: "line", label: "Short description", type: "text", required: true },
                {
                  name: "service",
                  label: "Links to service",
                  type: "relationship",
                  relationTo: "services",
                  required: true,
                },
                photo("image", "Preview photo"),
              ],
            },
          ],
        },
        {
          label: "Process & destinations",
          fields: [
            { name: "processHeading", label: "“How it works” heading", type: "text", required: true },
            {
              name: "processIntro",
              label: "“How it works” intro",
              type: "text",
              required: true,
              admin: { description: "The steps themselves are edited in Pages → Services page." },
            },
            { name: "destinationsHeading", label: "Destinations heading", type: "text", required: true },
            { name: "destinationsIntro", label: "Destinations intro", type: "textarea", required: true },
          ],
        },
        {
          label: "Instagram & closing",
          fields: [
            { name: "instagramHeading", label: "Instagram heading", type: "text", required: true },
            {
              name: "instagramImages",
              label: "Instagram photos",
              type: "upload",
              relationTo: "media",
              hasMany: true,
              maxRows: 8,
            },
            { name: "closingHeading", label: "Closing heading", type: "text", required: true },
            { name: "closingBody", label: "Closing text", type: "textarea", required: true },
            photo("closingImage", "Closing photo"),
          ],
        },
      ],
    },
  ],
}
