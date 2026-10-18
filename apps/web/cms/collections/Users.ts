import type { CollectionConfig } from "payload"

import { admins, adminsField, loggedIn } from "../lib/access"

export const Users: CollectionConfig = {
  slug: "users",
  labels: { singular: "Team member", plural: "Team members" },
  auth: true,
  admin: { useAsTitle: "name", defaultColumns: ["name", "email", "role"], group: "Settings" },
  access: {
    read: loggedIn,
    create: admins,
    update: ({ req, id }) => (req.user as { role?: string } | null)?.role === "admin" || req.user?.id === id,
    delete: admins,
  },
  fields: [
    { name: "name", type: "text", required: true },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "admin",
      options: [
        { label: "Admin (full access)", value: "admin" },
        { label: "Editor (content only)", value: "editor" },
      ],
      access: { update: adminsField },
    },
  ],
}
