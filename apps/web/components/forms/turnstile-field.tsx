"use client"

import { Turnstile } from "@marsidev/react-turnstile"
import { useTheme } from "next-themes"

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

/** Cloudflare Turnstile, rendered only when a site key is configured. */
export function TurnstileField({ onToken }: { onToken: (token: string) => void }) {
  const { resolvedTheme } = useTheme()
  if (!siteKey) return null
  return (
    <Turnstile
      siteKey={siteKey}
      onSuccess={onToken}
      onExpire={() => onToken("")}
      options={{ theme: resolvedTheme === "dark" ? "dark" : "light", size: "flexible" }}
    />
  )
}
