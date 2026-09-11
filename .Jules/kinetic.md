# HARD ABORT — CallToAction glass farm

Read this before scouting. If the idea is more glassmorphism, backdrop-filter, glow tokens, sheen, translateY hover, or micro-states on `CallToAction.astro` or the hire CTA, ABORT the cycle. Do not downscope into a sibling glass pass on the same button. Do not open a PR.

Closed as farm: #772, #667.

Prefer distinct motion craft on a live visitor surface that is not CTA glass. Hire path is LinkedIn only. Do not invent a public email or CV.

---

# Kinetic Journal ⚡

## 2026-08-30 - Portfolio Card Image Zoom & Reduced Motion

- **Signal:** Portfolio card previews lacked spatial depth on hover/focus and had incomplete reduced-motion media query coverage.
- **Action:**
  - Added hardware-accelerated image zoom (`transform: scale(1.05)`) with smooth `cubic-bezier(0.22, 1, 0.36, 1)` transition on `.card:hover img` and `.card:focus-visible img`.
  - Refined title overlay background & color transitions on hover/focus states (`hsla(var(--gray-999-basis), 0.95)`).
  - Enforced WCAG 2.1 AA compliance by adding `@media (prefers-reduced-motion: reduce)` to disable image scales, card translations, and shimmer animations.
- **Tokens Added:**
  - Card Image Zoom: `scale(1.05)`
  - Motion Easing: `cubic-bezier(0.22, 1, 0.36, 1)`

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
