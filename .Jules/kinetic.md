# HARD ABORT — CallToAction glass farm

Read this before scouting. If the idea is more glassmorphism, backdrop-filter, glow tokens, sheen, translateY hover, or micro-states on `CallToAction.astro` or the hire CTA, ABORT the cycle. Do not downscope into a sibling glass pass on the same button. Do not open a PR.

Closed as farm: #772, #667.

Prefer distinct motion craft on a live visitor surface that is not CTA glass. Hire path is LinkedIn only. Do not invent a public email or CV.

---

# Kinetic Journal ⚡

## 2026-08-30 - Glassmorphism & Pill Micro-Interactions | Signal: Surface consistency | Lean Implementation: Scoped Vanilla CSS in whats-new.astro and Pill.astro

- **Signal:** Section cards on `/whats-new/` lacked glassmorphic depth and interactive hover states; `Pill.astro` lacked smooth gradient transitions.
- **Action:**
  - Added `backdrop-filter: blur(16px) saturate(140%)` and `-webkit-backdrop-filter` to `.this-week` and `.last-30` cards on `src/pages/whats-new.astro`.
  - Added hardware-accelerated subtle hover elevation (`translateY(-2px)`, `border-color: var(--accent-overlay)`) gated behind `prefers-reduced-motion: no-preference`.
  - Added `transition` properties and smooth Northern Lights gradient shift (`background-position: 100% 50%`) with `translateY(-1px)` hover state to `src/components/Pill.astro`.
- **Tokens Added:**
  - What's New Glass Blur: `16px`, saturate: `140%`
  - What's New Hover Elevation: `translateY(-2px)`
  - Pill Gradient Hover: `background-position: 100% 50%`, `translateY(-1px)`

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
