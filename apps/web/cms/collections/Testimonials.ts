import type { CollectionConfig } from "payload"

import { loggedIn, publishedOrLoggedIn } from "../lib/access"
import { draftsWithAutosave, tripTypeOptions } from "../lib/options"
import { revalidateAfterChange, revalidateAfterDelete } from "../lib/revalidate"

export const Testimonials: CollectionConfig = {
  slug: "testimonials",
  labels: { singular: "Testimonial", plural: "Testimonials" },
  defaultSort: "order",
  admin: {
    group: "Content",
    useAsTitle: "clientName",
    defaultColumns: ["clientName", "trip", "featured", "order", "_status"],
    description: "Real client reviews only.",
  },
  access: { read: publishedOrLoggedIn, create: loggedIn, update: loggedIn, delete: loggedIn },
  versions: draftsWithAutosave,
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    { name: "quote", type: "textarea", required: true },
    {
      type: "row",
      fields: [
        {
          name: "clientName",
          label: "Client name",
          type: "text",
          required: true,
          admin: { description: "First name, or first name and last initial." },
        },
        { name: "trip", label: "Trip taken", type: "text", required: true },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "tripType", label: "Trip type", type: "select", options: tripTypeOptions },
        { name: "order", label: "Position", type: "number", defaultValue: 10 },
        { name: "featured", label: "Show on the homepage", type: "checkbox", defaultValue: true },
      ],
    },
    { name: "photo", label: "Client photo (optional)", type: "upload", relationTo: "media" },
  ],
}
