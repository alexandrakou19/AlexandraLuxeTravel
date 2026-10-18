import type { CollectionConfig } from "payload"

import { loggedIn, publishedOrLoggedIn } from "../lib/access"
import { draftsWithAutosave, tripTypeOptions } from "../lib/options"
import { revalidateAfterChange, revalidateAfterDelete } from "../lib/revalidate"

export const Services: CollectionConfig = {
  slug: "services",
  labels: { singular: "Service", plural: "Services" },
  defaultSort: "order",
  admin: {
    group: "Content",
    useAsTitle: "title",
    defaultColumns: ["title", "order", "_status", "updatedAt"],
    description: "The travel planning services shown on the Services page and the homepage.",
  },
  access: { read: publishedOrLoggedIn, create: loggedIn, update: loggedIn, delete: loggedIn },
  versions: draftsWithAutosave,
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    { name: "title", type: "text", required: true },
    {
      type: "row",
      fields: [
        { name: "shortTitle", label: "Short name (for menus)", type: "text", required: true },
        {
          name: "anchor",
          label: "Link name",
          type: "text",
          required: true,
          unique: true,
          admin: { description: "Used in links like /services#family. Lowercase, no spaces." },
        },
        { name: "order", label: "Position on the page", type: "number", required: true, defaultValue: 10 },
      ],
    },
    { name: "summary", type: "textarea", required: true, admin: { description: "One or two sentences." } },
    {
      name: "body",
      label: "Description",
      type: "textarea",
      required: true,
      admin: { description: "Leave an empty line between paragraphs.", rows: 8 },
    },
    {
      name: "included",
      label: "What’s included",
      type: "array",
      labels: { singular: "Item", plural: "Items" },
      fields: [{ name: "item", type: "text", required: true }],
    },
    { name: "idealFor", label: "Ideal for", type: "textarea", required: true },
    { name: "image", label: "Photo", type: "upload", relationTo: "media", required: true },
    {
      name: "tripType",
      label: "Trip type preselected in the inquiry form",
      type: "select",
      required: true,
      options: tripTypeOptions,
    },
  ],
}
