# Alexandra Luxe Travel — Design System: "The Field Journal"

A well-traveled mother's luxury magazine: ivory paper, big serif headlines, champagne hairlines, her real photographs captioned like magazine credits.

## Color (tokens in packages/ui/src/styles/globals.css)
| Token | Light | Dark ("Espresso") | Use |
|---|---|---|---|
| background | Warm Ivory #F7F3EE | #1E1A17 | Page |
| surface | Sand #E6DCCF | #2A2420 | Alternate bands, form panels |
| foreground | Warm Charcoal #3B3734 | #EFE8DE | Text, headings, primary buttons |
| ink-soft | Deep Taupe #6E655B (#5E564D on sand) | #B9AE9F | Secondary text, captions |
| hairline | #D9CFC2 | #3D3530 | Dividers |
| accent-line | Muted Champagne #C8B89E | same | Hairlines, ornaments, focus ring only. Never text on ivory |
| band | Charcoal #3B3734 | #141110 | Footer, amenities and CTA bands |

All text pairs meet WCAG AA. No gold gradients, metallic textures, glass or heavy shadows.

## Type
- **Display:** Cormorant Garamond (variable, 500/600, italic for one accent word per heading). `.display-1` (H1, ~40–80px), `.display-2`, `.display-3`.
- **Body/UI:** Jost (variable, 300/400/500). Body 17px / 1.7. Buttons and nav 500, uppercase, 0.18em tracking.
- **Eyebrows:** Jost 500, 12px, 0.22em, uppercase. Required by the brief; use sparingly.

## Layout
- 1240px container (`.container-editorial`); full-bleed photo heroes break out of it.
- Section rhythm `.section-pad`: 72px mobile / 120px desktop.
- Asymmetric 12-column pairs, overlapping secondary frames, hairline-divided lists. No equal three-card rows.
- Radius 0–4px. Square photos with captions (`<Caption>`: hairline + location).

## Motion (components/motion)
One authored language: things rise out of masks with an exponential ease-out (`expo.out`, `cubic-bezier(0.16,1,0.3,1)`).
- Lenis smooth scroll on the GSAP ticker (off for reduced motion).
- `Reveal` lines / image curtain / stagger / fade; `Drift` (≤ 8–18% scrub); `Magnetic` for Inquire CTAs; `CountUp` for her real stats.
- Signature moments: hero mask-line headline and photo settle; pinned horizontal destination pan (≥1024px); self-drawing process hairline; amenities marquee; cursor-following journey previews.
- Route changes (View Transitions, `app/(site)/template.tsx` + globals.css "Route changes"): the old page lifts and softens away (220ms), the new one is revealed down the page through a feathered mask (850ms expo-out); the header and progress line stay anchored. A tapped destination card's photo grows into its hero (`lib/transitions.ts`). Browsers without View Transitions get a fade.
- Route progress: a 2px champagne line drawn across the top with a brighter nib and a slow shimmer, shown only for navigations slower than 120ms; it completes, then sweeps out to the right.
- Above-the-fold text animates with CSS only (`.rise-in`, `.mask-line`) so it never waits on JS. Everything is static under `prefers-reduced-motion`.
- `motion` (Framer) is used only in the destination filter and inquiry form steps, never in the same tree as GSAP.

## Components
`InquireLink` (all Inquire/Start planning CTAs; tracked + magnetic), `Logo` (her original on light surfaces, her reversed ivory logo on dark ones), `Photo`/`Caption`, `PageHero`, form `Field`/`TextInput`/`Select`/`CheckboxRow`/`ChoiceChips` (native controls, 44px+ targets, label above, error below with role=alert).
