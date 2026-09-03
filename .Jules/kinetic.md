# HARD ABORT — CallToAction glass farm

Read this before scouting. If the idea is more glassmorphism, backdrop-filter, glow tokens, sheen, translateY hover, or micro-states on `CallToAction.astro` or the hire CTA, ABORT the cycle. Do not downscope into a sibling glass pass on the same button. Do not open a PR.

Closed as farm: #772, #667.

Prefer distinct motion craft on a live visitor surface that is not CTA glass. Hire path is LinkedIn only. Do not invent a public email or CV.

---

# Kinetic Journal ⚡

## 2026-08-29 - CTA glass abort | Signal: closed #772/#667 | Lean Implementation: HARD ABORT CallToAction glassmorphism and micro-states

## 2026-08-30 - Portfolio Card Image Zoom & Title Micro-Interactions

- **Signal:** Portfolio preview cards lacked spatial focal depth on image hover and subtle contrast elevation on titles.
- **Action:**
  - Added hardware-accelerated image zoom (`transform: scale(1.05)`) with smooth `0.5s cubic-bezier(0.22, 1, 0.36, 1)` easing inside `PortfolioPreview.astro`.
  - Added title border and text color contrast transitions on card hover/focus-visible states.
  - Enforced WCAG 2.1 AA compliance using `@media (prefers-reduced-motion: reduce)` rules.
- **Tokens Added:**
  - Image Scale: `scale(1.05)`
  - Title Hover Color: `var(--gray-0)`
  - Title Hover Border: `hsla(var(--gray-999-basis), 0.3)`

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
