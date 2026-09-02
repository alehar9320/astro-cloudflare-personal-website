# HARD ABORT — CallToAction glass farm

Read this before scouting. If the idea is more glassmorphism, backdrop-filter, glow tokens, sheen, translateY hover, or micro-states on `CallToAction.astro` or the hire CTA, ABORT the cycle. Do not downscope into a sibling glass pass on the same button. Do not open a PR.

Closed as farm: #772, #667.

Prefer distinct motion craft on a live visitor surface that is not CTA glass. Hire path is LinkedIn only. Do not invent a public email or CV.

---

# Kinetic Journal ⚡

## 2026-09-02 - Interactive Gradient Sweep for Pill Component

- **Signal:** Tag pills (`Pill.astro`) possessed base gradient properties but lacked fluid hover/active state feedback.
- **Action:**
  - Added smooth hardware-accelerated `background-position` gradient sweep (0% to 100%) on hover for `Pill.astro`.
  - Added subtle `translateY(-1px)` lift and `scale(0.98)` tactile press state.
  - Added soft accent glow `hsla(210, 100%, 45%, 0.3)`.
  - Wrapped interactive transforms and transitions in `@media (prefers-reduced-motion: no-preference)` and `prefers-reduced-motion: reduce`.
- **Tokens & Snippets:**
  - Gradient Sweep: `background-position: 100% 50%`
  - Lift & Press: `translateY(-1px)`, `scale(0.98)`
  - Glow: `0 4px 14px hsla(210, 100%, 45%, 0.3)`

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
