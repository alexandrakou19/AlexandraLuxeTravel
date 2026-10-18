# Alexandra Luxe Travel — Product

## What it is
Marketing site for Alexandra Luxe Travel, a new US-based luxury travel agency founded by Alexandra (wife, mother of three; 30+ countries, 40+ U.S. states, 400 destinations). The site has one job: **turn visitors into qualified trip inquiries.** Direct booking is out of scope for v1, but the code leaves room for it.

## Who it serves
- **Signature:** families who want luxury international travel with children.
- **Equally welcome:** couples, honeymooners, destination weddings, groups and multigenerational trips, bucket-list travelers.
- The site must never read as "family-only."

## Positioning & voice
- "A luxury travel magazine meets a boutique travel agency." Understated, warm, personal. Never flashy, never "overly gold."
- First person, Alexandra's own words wherever possible. US English.
- No additional planning fee: mention it tastefully, never as the headline.
- Works with many travel styles and budgets; luxury is about the experience, not the price tag.

## Truth rules
- Never invent facts: no fake testimonials, press logos, credentials or partnerships.
- Stock photos only fill gaps and are never presented as her trips or clients (source URL recorded in content/media.ts).
- Copy marked `REVIEW(Saad)` is placeholder or connecting copy awaiting client sign-off.

## Surfaces
| Surface | Mode | Success |
|---|---|---|
| Home, Services, Destinations, About, Testimonials | Persuade | Visitor clicks Inquire / Start planning |
| Inquire (3-step form) | Operate | Visitor submits a complete inquiry on a phone without friction |
| Contact, Privacy | Read | Visitor finds what they need |

## Platform
Next.js 16 (App Router) + Tailwind v4 + shadcn (base-ui) in a bun/turbo monorepo, with Payload CMS 3 at `/admin` (Postgres on Neon, uploads on Vercel Blob). `lib/content.ts` is the only seam between pages and the CMS. Inquiries are saved in the CMS first, then emailed via Resend and synced to TravelJoy via Zapier. Hosting: Vercel.

- `cms/`: collections, globals, access rules, revalidation hooks, migrations
- `content/`: launch content used by `bun run seed` (and the view-model types)
- Schema changes: edit `cms/`, then `bun run payload migrate:create <name>`; production runs pending migrations on start.
