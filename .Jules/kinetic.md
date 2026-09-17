# HARD ABORT — CallToAction glass farm

Read this before scouting. If the idea is more glassmorphism, backdrop-filter, glow tokens, sheen, translateY hover, or micro-states on `CallToAction.astro` or the hire CTA, ABORT the cycle. Do not downscope into a sibling glass pass on the same button. Do not open a PR.

Closed as farm: #772, #667.

Prefer distinct motion craft on a live visitor surface that is not CTA glass. Hire path is LinkedIn only. Do not invent a public email or CV.

---

# Kinetic Journal ⚡

## 2026-03-31 - Portfolio Card Image Zoom & Accessibility Motion Guardrails

- **Signal:** Portfolio preview cards lacked spatial motion depth on nested image nodes and lacked WCAG 2.1 AA `prefers-reduced-motion` animation safety.
- **Action:**
  - Enhanced `PortfolioPreview.astro` with hardware-accelerated `transform: scale(1.04)` image zoom transition on card hover and focus-visible states using `cubic-bezier(0.22, 1, 0.36, 1)`.
  - Added `@media (prefers-reduced-motion: reduce)` block to disable card/image transitions, transforms, and shimmer animations for motion-sensitive users.
  - Added `@media (forced-colors: active)` support with `border-color: CanvasText` for high-contrast accessibility.
- **Tokens Added:**
  - Image Scale Zoom: `scale(1.04)`
  - Transition Easing: `0.5s cubic-bezier(0.22, 1, 0.36, 1)`
  - High Contrast Boundary: `border-color: CanvasText`

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
