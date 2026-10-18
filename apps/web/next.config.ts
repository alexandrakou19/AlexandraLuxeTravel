import { withPayload } from "@payloadcms/next/withPayload"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [70, 80],
    deviceSizes: [420, 640, 828, 1080, 1280, 1600, 2048],
    // Static brand files and CMS uploads (local in development, Vercel Blob in production).
    localPatterns: [{ pathname: "/images/**" }, { pathname: "/icon.png" }, { pathname: "/api/media/file/**" }],
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
  transpilePackages: ["@workspace/ui"],
  experimental: {
    // The site and the CMS admin have separate root layouts.
    globalNotFound: true,
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
