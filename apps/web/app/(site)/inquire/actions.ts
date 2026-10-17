"use server"

import { headers } from "next/headers"

import { processInquiry, type SubmitResult } from "@/lib/inquiry/pipeline"

async function clientIp() {
  const h = await headers()
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown"
}

export async function submitInquiry(values: unknown): Promise<SubmitResult> {
  return processInquiry(values, await clientIp())
}
