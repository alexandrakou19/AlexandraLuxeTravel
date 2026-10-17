import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [70, 80],
    deviceSizes: [420, 640, 828, 1080, 1280, 1600, 2048],
    remotePatterns: [],
  },
  transpilePackages: ["@workspace/ui"],
}

export default nextConfig
