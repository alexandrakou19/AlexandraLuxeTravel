export function absoluteUrl(path = "/") {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://alexandraluxetravel.com"
  return new URL(path, base).toString()
}
