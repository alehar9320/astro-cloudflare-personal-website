## HARD ABORT — inert pills (owner lock 2026-10-10)

Read this before scouting. It overrides any idea below.

- Never change `src/**/Pill.astro` or the case-study tag pills.
- No hover lift (`translateY`), glow, shadow, shimmer, gradient, sweep, tactile press, or any other motion on inert or non-interactive elements.
- Never add or flip any `enable_pill_*` feature flag.
- If your plan touches any of these, stop and exit the cycle without opening a PR. Do not downscope into a sibling pill pass.

Closed as farm: #1653, #1646, #1603, #1597, #1590, #1587, #1582, #1568, #1552, #1541.

---

# HARD ABORT — CallToAction glass farm

Read this before scouting. If the idea is more glassmorphism, backdrop-filter, glow tokens, sheen, translateY hover, or micro-states on `CallToAction.astro` or the hire CTA, ABORT the cycle. Do not downscope into a sibling glass pass on the same button. Do not open a PR.

Closed as farm: #772, #667.

Prefer distinct motion craft on a live visitor surface that is not CTA glass. Hire path is LinkedIn only. Do not invent a public email or CV.

---

# Kinetic Journal ⚡

## 2026-03-31 - Parallax Image Scale Zoom for Portfolio Preview Cards

- **Signal:** Portfolio preview cards displayed static images without depth during hover/focus states.
- **Action:**
  - Added hardware-accelerated `transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)` to `img` in `src/components/PortfolioPreview.astro`.
  - Applied subtle `transform: scale(1.04)` on `.card:hover img` and `.card:focus-visible img`.
  - Gated motion inside `@media (prefers-reduced-motion: reduce)` to disable transitions for users preferring reduced motion.
- **Tokens Added:**
  - Image Parallax Zoom: `scale(1.04)`
  - Motion Curve: `cubic-bezier(0.22, 1, 0.36, 1)`

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
