"use server"

import { headers } from "next/headers"

import { processContact, type SubmitResult } from "@/lib/inquiry/pipeline"

async function clientIp() {
  const h = await headers()
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown"
}

export async function submitContact(values: unknown): Promise<SubmitResult> {
  return processContact(values, await clientIp())
}
