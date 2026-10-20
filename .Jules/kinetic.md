# Kinetic Journal ⚡

## HARD ABORT — inert pills (owner lock 2026-10-10)

Read this before scouting. It overrides any idea below.

- Never change `src/**/Pill.astro` or the case-study tag pills.
- No hover lift (`translateY`), glow, shadow, shimmer, gradient, sweep, tactile press, or any other motion on inert or non-interactive elements.
- An inert pill with a hover effect is a fake affordance: it looks clickable and isn't.
- Never add or flip any `enable_pill_*` feature flag.
- If your plan touches any of these, stop and exit the cycle without opening a PR. Do not downscope into a sibling pill pass.

Closed as farm: #1653, #1646, #1631, #1611, #1603, #1597, #1590, #1587, #1582, #1568, #1552, #1541.

---

## GUARD — orphaned components (Lead UX lock 2026-10-11)

Read this before proposing any visual or motion change to a component.

- First check that a routed page renders it: `rg -n "<ComponentName\b" src/pages src/layouts src/components` (the `\b` catches `<X />` and `<X prop>`). A hit in `src/components` only counts if that parent component is itself rendered by a routed page; follow the chain up to `src/pages`.
- If no live page renders the component, do not propose the change. Stop and exit the cycle without opening a PR.
- `src/components/PortfolioPreview.astro` is orphaned: no live page renders it, and `src/__tests__/identity.test.ts` forbids it on `/work/`. Do not polish it.

Wasted runs on orphaned components: #1683, #1125, #1339, #1351, #1363.

---

## HARD ABORT — CallToAction glass farm

Read this before scouting. If the idea is more glassmorphism, backdrop-filter, glow tokens, sheen, translateY hover, or micro-states on `CallToAction.astro` or the hire CTA, ABORT the cycle. Do not downscope into a sibling glass pass on the same button. Do not open a PR.

Closed as farm: #772, #667.

Prefer distinct motion craft on a live visitor surface that is not CTA glass. Hire path is LinkedIn only. Do not invent a public email or CV.

---

## 2026-08-29 - CTA glass abort | Signal: closed #772/#667 | Lean Implementation: HARD ABORT CallToAction glassmorphism and micro-states

## 2025-05-15 - Interactive Glassmorphism for Skills Section

- **Signal:** Standardized skills box lacked interactive affordance and depth.
- **Action:**
  - Upgraded `.box` in `src/components/Skills.astro` with `backdrop-filter: blur(16px)` for enhanced glassmorphism.
  - Implemented hardware-accelerated hover state with `translateY(-4px)` for better visual hierarchy.
  - Aligned hover shadow with "Northern Lights" palette using `hsla(210, 100%, 45%, 0.3)`.
  - Added `prefers-reduced-motion` safety for accessibility.
- **Tokens Added:**
  - Glass Blur: `16px`
  - Affordance: `translateY(-4px)`
  - Glow: `hsla(210, 100%, 45%, 0.3)`

## 2026-03-30 - Northern Lights Experience Timeline Connectors & Glow Nodes

- **Signal:** Standard list bullets on the biography page (`src/pages/biography.astro`) lacked thematic alignment with the personal portfolio's Northern Lights visual identity.
- **Action:**
  - Added a Northern Lights linear gradient vertical connector line (`.timeline::before`) to visually bridge milestone entries.
  - Replaced standard list bullets with glowing cyan pseudo-element nodes (`.timeline > li::before`).
  - Implemented a hardware-accelerated scale transform (`transform: scale(1.25)`) on node focus and hover states inside `@media (prefers-reduced-motion: no-preference)`.
  - Added high contrast mode compatibility via `@media (forced-colors: active)`.
