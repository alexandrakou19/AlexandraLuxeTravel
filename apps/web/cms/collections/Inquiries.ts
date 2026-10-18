import type { CollectionConfig, Field } from "payload"

import { admins, loggedIn } from "../lib/access"
import { tripTypeOptions } from "../lib/options"

/** Visitor answers are a record: visible to the team, never editable. */
const answer = (field: Field): Field => ({
  ...field,
  admin: { ...(field.admin ?? {}), readOnly: true },
  access: { update: () => false },
} as Field)

export const Inquiries: CollectionConfig = {
  slug: "inquiries",
  labels: { singular: "Inquiry", plural: "Inquiries" },
  defaultSort: "-createdAt",
  admin: {
    group: "Leads",
    useAsTitle: "name",
    defaultColumns: ["name", "type", "tripType", "destination", "status", "createdAt"],
    listSearchableFields: ["name", "email", "destination"],
    description: "Every trip inquiry and contact message from the website, newest first. Update the status and add private notes as you go.",
  },
  access: {
    read: loggedIn,
    // Only the website (server side) creates inquiries.
    create: () => false,
    update: loggedIn,
    delete: admins,
  },
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "status",
          type: "select",
          required: true,
          defaultValue: "new",
          options: [
            { label: "New", value: "new" },
            { label: "Contacted", value: "contacted" },
            { label: "Proposal sent", value: "proposal" },
            { label: "Booked", value: "booked" },
            { label: "Closed", value: "closed" },
          ],
        },
        answer({
          name: "type",
          type: "select",
          required: true,
          defaultValue: "trip",
          options: [
            { label: "Trip inquiry", value: "trip" },
            { label: "Contact message", value: "contact" },
          ],
        }),
      ],
    },
    { name: "internalNotes", label: "Private notes", type: "textarea", admin: { description: "Only your team can see these." } },
    {
      type: "tabs",
      tabs: [
        {
          label: "Traveler",
          fields: [
            answer({ name: "name", type: "text", required: true }),
            {
              type: "row",
              fields: [answer({ name: "firstName", type: "text" }), answer({ name: "lastName", type: "text" })],
            },
            {
              type: "row",
              fields: [answer({ name: "email", type: "email", required: true }), answer({ name: "phone", type: "text" })],
            },
            {
              type: "row",
              fields: [
                answer({ name: "contactMethod", label: "Preferred contact", type: "text" }),
                answer({ name: "basedIn", label: "Based in", type: "text" }),
              ],
            },
            answer({ name: "message", label: "Message (contact form)", type: "textarea" }),
          ],
        },
        {
          label: "Trip",
          fields: [
            {
              type: "row",
              fields: [
                answer({ name: "tripType", label: "Trip type", type: "select", options: tripTypeOptions }),
                answer({ name: "destination", type: "text" }),
              ],
            },
            answer({ name: "travelDates", label: "Travel dates", type: "text" }),
            {
              type: "row",
              fields: [
                answer({ name: "nights", type: "text" }),
                answer({ name: "adults", type: "text" }),
                answer({ name: "children", type: "text" }),
                answer({ name: "childAges", label: "Children’s ages", type: "text" }),
              ],
            },
            answer({ name: "occasion", type: "text" }),
          ],
        },
        {
          label: "Preferences",
          fields: [
            answer({ name: "budget", type: "text" }),
            answer({ name: "accommodation", type: "text" }),
            answer({ name: "pace", type: "text" }),
            answer({ name: "interests", type: "text" }),
            answer({ name: "heardFrom", label: "How they heard about us", type: "text" }),
            answer({ name: "notes", label: "Anything else", type: "textarea" }),
          ],
        },
      ],
    },
    {
      name: "crm",
      label: "TravelJoy sync",
      type: "group",
      admin: { position: "sidebar" },
      fields: [
        answer({
          name: "status",
          type: "select",
          defaultValue: "pending",
          options: [
            { label: "Pending", value: "pending" },
            { label: "Sent", value: "sent" },
            { label: "Failed", value: "failed" },
            { label: "Not configured", value: "skipped" },
            { label: "Not applicable", value: "na" },
          ],
        }),
        answer({ name: "error", type: "textarea" }),
      ],
    },
    {
      name: "emails",
      label: "Emails",
      type: "group",
      admin: { position: "sidebar" },
      fields: [
        answer({ name: "notification", label: "Notification to you", type: "text" }),
        answer({ name: "autoReply", label: "Thank-you to traveler", type: "text" }),
      ],
    },
  ],
}
