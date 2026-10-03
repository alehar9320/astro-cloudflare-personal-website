# HARD ABORT — CallToAction glass farm

Read this before scouting. If the idea is more glassmorphism, backdrop-filter, glow tokens, sheen, translateY hover, or micro-states on `CallToAction.astro` or the hire CTA, ABORT the cycle. Do not downscope into a sibling glass pass on the same button. Do not open a PR.

Closed as farm: #772, #667.

Prefer distinct motion craft on a live visitor surface that is not CTA glass. Hire path is LinkedIn only. Do not invent a public email or CV.

---

# Kinetic Journal ⚡

## 2026-08-30 - Spatial Depth Card Image Zoom | Signal: Static portfolio images lacked motion depth on hover | Lean Implementation: Added hardware-accelerated image scale transition on hover/focus-visible in `PortfolioPreview.astro`

- **Action:**
  - Added hardware-accelerated `transform: scale(1.05)` with smooth `cubic-bezier(0.22, 1, 0.36, 1)` transition (0.5s) on `.card:hover img` and `.card:focus-visible img` in `src/components/PortfolioPreview.astro`.
  - Enforced WCAG 2.1 AA accessibility by resetting `transition: none` and `transform: none` under `@media (prefers-reduced-motion: reduce)`.
- **Snippets Added:**
  - `transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)` & `transform: scale(1.05)`

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
