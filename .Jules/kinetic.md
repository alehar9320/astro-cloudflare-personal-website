# HARD ABORT — CallToAction glass farm

Read this before scouting. If the idea is more glassmorphism, backdrop-filter, glow tokens, sheen, translateY hover, or micro-states on `CallToAction.astro` or the hire CTA, ABORT the cycle. Do not downscope into a sibling glass pass on the same button. Do not open a PR.

Closed as farm: #772, #667.

Prefer distinct motion craft on a live visitor surface that is not CTA glass. Hire path is LinkedIn only. Do not invent a public email or CV.

---

# Kinetic Journal ⚡

## 2026-03-31 - Portfolio Preview Image Parallax Zoom

- **Signal:** Portfolio project preview cards translated upward on hover, but internal preview images remained static, lacking motion depth.
- **Action:**
  - Added smooth, hardware-accelerated image zoom transition (`transform: scale(1.04)`) to `img` in `src/components/PortfolioPreview.astro` on `.card:hover` and `.card:focus-visible`.
  - Used `transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)` matching card translation easing for cohesive motion feel.
  - Ensured WCAG compliance by gating image zoom transform inside `@media (prefers-reduced-motion: no-preference)`.
- **Tokens/Snippets Added:**
  - Card Image Zoom: `scale(1.04)`
  - Transition Easing: `cubic-bezier(0.22, 1, 0.36, 1)`

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
