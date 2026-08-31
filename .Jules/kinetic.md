# HARD ABORT — CallToAction glass farm

Read this before scouting. If the idea is more glassmorphism, backdrop-filter, glow tokens, sheen, translateY hover, or micro-states on `CallToAction.astro` or the hire CTA, ABORT the cycle. Do not downscope into a sibling glass pass on the same button. Do not open a PR.

Closed as farm: #772, #667.

Prefer distinct motion craft on a live visitor surface that is not CTA glass. Hire path is LinkedIn only. Do not invent a public email or CV.

---

# Kinetic Journal ⚡

## 2026-08-31 - Nav Social Links Micro-Interaction & Focus Polish | Signal: Visual consistency and micro-state affordance pass | Lean Implementation: Added scoped hover/active micro-interactions and Northern Lights subtle glow on Nav social links in Nav.astro

- **Signal:** Nav social icon links lacked subtle hover feedback and glow affordance compared to interactive navigation components.
- **Action:**
  - Added scoped hover state with hardware-accelerated `translateY(-2px) scale(1.04)` transform and subtle background overlay (`var(--accent-subtle-overlay)`).
  - Integrated Northern Lights cyan glow on hover using `box-shadow: 0 0 12px hsla(210, 100%, 45%, 0.25)`.
  - Maintained accessible focus-visible outlines (`outline: 2px solid var(--accent-regular)`, `outline-offset: 4px`) and `@media (prefers-reduced-motion: reduce)` safety.
- **Tokens Added/Applied:**
  - Glow: `0 0 12px hsla(210, 100%, 45%, 0.25)`
  - Hover Affordance: `translateY(-2px) scale(1.04)`

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
