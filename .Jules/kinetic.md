# HARD ABORT — CallToAction glass farm

Read this before scouting. If the idea is more glassmorphism, backdrop-filter, glow tokens, sheen, translateY hover, or micro-states on `CallToAction.astro` or the hire CTA, ABORT the cycle. Do not downscope into a sibling glass pass on the same button. Do not open a PR.

Closed as farm: #772, #667.

Prefer distinct motion craft on a live visitor surface that is not CTA glass. Hire path is LinkedIn only. Do not invent a public email or CV.

---

# Kinetic Journal ⚡

## 2026-09-24 - Pill Gradient Shift, Card Image Zoom, and Nav Touch Ergonomics

- **Signal:** Pills had static gradient backgrounds without interactive affordance; PortfolioPreview lacked spatial depth on image hover; Nav social links had narrow touch areas and potential focus clipping.
- **Action:**
  - Activated wide gradient hover position shift (`background-position: 100% 50%`) on `Pill.astro` with `cubic-bezier(0.22, 1, 0.36, 1)` transition and `prefers-reduced-motion` override.
  - Implemented hardware-accelerated image zoom (`transform: scale(1.05)`) on `.card:hover img` in `PortfolioPreview.astro` with `prefers-reduced-motion` safety.
  - Applied minimum 44x44px touch targets (`min-width: 44px; min-height: 44px; align-items: center; justify-content: center;`) and tight `outline-offset: 2px` focus ring containment on `.social` icon links in `Nav.astro`.
- **Tokens Added:**
  - Gradient Shift Transition: `background-position 0.4s cubic-bezier(0.22, 1, 0.36, 1)`
  - Card Image Scale: `transform: scale(1.05)`
  - Social Touch Target Sizing: `min-width: 44px; min-height: 44px`

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
