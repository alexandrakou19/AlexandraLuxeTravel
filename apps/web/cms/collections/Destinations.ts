import type { CollectionConfig } from "payload"

import { loggedIn, publishedOrLoggedIn } from "../lib/access"
import { draftsWithAutosave, experienceTagOptions } from "../lib/options"
import { revalidateAfterChange, revalidateAfterDelete } from "../lib/revalidate"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

export const Destinations: CollectionConfig = {
  slug: "destinations",
  labels: { singular: "Destination", plural: "Destinations" },
  defaultSort: "title",
  admin: {
    group: "Content",
    useAsTitle: "title",
    defaultColumns: ["title", "region", "featured", "_status", "updatedAt"],
    description: "Each destination gets its own page automatically and appears in the sitemap.",
    livePreview: {
      url: ({ data }) => `${siteUrl}/next/preview?path=/destinations/${data?.slug ?? ""}`,
    },
    preview: (doc) => `${siteUrl}/next/preview?path=/destinations/${doc?.slug ?? ""}`,
  },
  access: { read: publishedOrLoggedIn, create: loggedIn, update: loggedIn, delete: loggedIn },
  versions: draftsWithAutosave,
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    { name: "title", type: "text", required: true },
    {
      type: "row",
      fields: [
        { name: "region", label: "Country or region", type: "text", required: true },
        {
          name: "featured",
          label: "Feature on the homepage",
          type: "checkbox",
          defaultValue: false,
        },
      ],
    },
    {
      name: "tags",
      label: "Experiences (for the filters)",
      type: "select",
      hasMany: true,
      options: experienceTagOptions,
    },
    { name: "cover", label: "Main photo", type: "upload", relationTo: "media", required: true },
    { name: "teaser", label: "One-line teaser", type: "text", required: true },
    {
      name: "intro",
      label: "Introduction",
      type: "textarea",
      required: true,
      admin: { description: "Leave an empty line between paragraphs. The first paragraph is shown larger.", rows: 8 },
    },
    {
      name: "places",
      label: "Places",
      type: "array",
      labels: { singular: "Place", plural: "Places" },
      fields: [{ name: "name", type: "text", required: true }],
    },
    { name: "bestTime", label: "Best time to go", type: "text", required: true },
    {
      name: "signatureExperiences",
      label: "Signature experiences",
      type: "array",
      labels: { singular: "Experience", plural: "Experiences" },
      fields: [{ name: "item", type: "text", required: true }],
    },
    {
      name: "perfectFor",
      label: "Perfect for",
      type: "array",
      labels: { singular: "Tag", plural: "Tags" },
      fields: [{ name: "item", type: "text", required: true }],
    },
    { name: "gallery", label: "Photo gallery", type: "upload", relationTo: "media", hasMany: true },
    {
      name: "related",
      label: "Related destinations",
      type: "relationship",
      relationTo: "destinations",
      hasMany: true,
      maxRows: 3,
      filterOptions: ({ id }) => ({ id: { not_equals: id } }),
    },
    {
      name: "slug",
      label: "Page address",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: {
        position: "sidebar",
        description: "The end of the page link, e.g. “greece” for /destinations/greece. Lowercase, use dashes.",
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) =>
            (value || data?.title || "")
              .toString()
              .toLowerCase()
              .normalize("NFKD")
              .replace(/[̀-ͯ]/g, "")
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, ""),
        ],
      },
    },
  ],
}
