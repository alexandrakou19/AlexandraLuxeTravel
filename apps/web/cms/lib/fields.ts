import type { Field } from "payload"

export const paragraphs = (name: string, label?: string, required = true): Field => ({
  name,
  label,
  type: "textarea",
  required,
  admin: { description: "Leave an empty line between paragraphs.", rows: 7 },
})

export const photo = (name: string, label: string, required = true): Field => ({
  name,
  label,
  type: "upload",
  relationTo: "media",
  required,
})

export const textList = (name: string, label: string, singular = "Item"): Field => ({
  name,
  label,
  type: "array",
  labels: { singular, plural: label },
  fields: [{ name: "item", type: "text", required: true }],
})

export const steps = (name: string, label: string): Field => ({
  name,
  label,
  type: "array",
  labels: { singular: "Step", plural: "Steps" },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "body", type: "textarea", required: true },
  ],
})
