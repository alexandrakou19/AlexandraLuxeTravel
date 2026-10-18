import path from "node:path"
import { fileURLToPath } from "node:url"

import { postgresAdapter } from "@payloadcms/db-postgres"
import { resendAdapter } from "@payloadcms/email-resend"
import { seoPlugin } from "@payloadcms/plugin-seo"
import { lexicalEditor } from "@payloadcms/richtext-lexical"
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob"
import { buildConfig } from "payload"
import sharp from "sharp"

import { Destinations } from "./cms/collections/Destinations"
import { Inquiries } from "./cms/collections/Inquiries"
import { Media } from "./cms/collections/Media"
import { Services } from "./cms/collections/Services"
import { Testimonials } from "./cms/collections/Testimonials"
import { Users } from "./cms/collections/Users"
import { AboutPage } from "./cms/globals/AboutPage"
import { ContactPage } from "./cms/globals/ContactPage"
import { HomePage } from "./cms/globals/HomePage"
import { InquiryPage } from "./cms/globals/InquiryPage"
import { PrivacyPolicy } from "./cms/globals/PrivacyPolicy"
import { ServicesPage } from "./cms/globals/ServicesPage"
import { SiteSettings } from "./cms/globals/SiteSettings"
import { migrations } from "./cms/migrations"

const dirname = path.dirname(fileURLToPath(import.meta.url))
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

// "Alexandra Luxe Travel <hello@alexandraluxetravel.com>" -> name + address
const from = (process.env.EMAIL_FROM ?? "Alexandra Luxe Travel <hello@alexandraluxetravel.com>").match(/^(.*)<(.+)>$/)

export default buildConfig({
  serverURL: siteUrl,
  secret: process.env.PAYLOAD_SECRET || "",
  admin: {
    user: Users.slug,
    // Light only: matches the brand and keeps the espresso logo legible.
    theme: "light",
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: " · Alexandra Luxe Travel",
      icons: [{ rel: "icon", type: "image/png", url: "/icon.png" }],
    },
    components: {
      graphics: {
        Logo: "./cms/components/AdminLogo#AdminLogo",
        Icon: "./cms/components/AdminIcon#AdminIcon",
      },
    },
    livePreview: {
      breakpoints: [
        { label: "Phone", name: "phone", width: 390, height: 844 },
        { label: "Tablet", name: "tablet", width: 820, height: 1180 },
        { label: "Desktop", name: "desktop", width: 1440, height: 900 },
      ],
    },
  },
  collections: [Inquiries, Destinations, Services, Testimonials, Media, Users],
  globals: [HomePage, AboutPage, ServicesPage, ContactPage, InquiryPage, PrivacyPolicy, SiteSettings],
  editor: lexicalEditor(),
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI || "" },
    migrationDir: path.resolve(dirname, "cms/migrations"),
    // Schema changes always go through migrations (same SQL locally and on Vercel).
    push: false,
    // Pending migrations run automatically when the production server starts.
    prodMigrations: migrations,
  }),
  sharp,
  email: process.env.RESEND_API_KEY
    ? resendAdapter({
        apiKey: process.env.RESEND_API_KEY,
        defaultFromName: from?.[1]?.trim() || "Alexandra Luxe Travel",
        defaultFromAddress: from?.[2]?.trim() || "hello@alexandraluxetravel.com",
      })
    : undefined,
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
  plugins: [
    seoPlugin({
      collections: ["destinations"],
      globals: ["home-page", "about-page", "services-page"],
      uploadsCollection: "media",
      tabbedUI: true,
      generateTitle: ({ doc }) => (doc?.title ? `${doc.title} Travel · Alexandra Luxe Travel` : "Alexandra Luxe Travel"),
      generateDescription: ({ doc }) => doc?.teaser ?? "",
    }),
    // Uploads go to Vercel Blob in production (Vercel's filesystem is read-only).
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      // Photos are public, so serve them straight from Blob instead of proxying through /api/media.
      collections: { media: { disablePayloadAccessControl: true } },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
})
