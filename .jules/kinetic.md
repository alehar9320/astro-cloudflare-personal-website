# Kinetic Journal ⚡

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

## 2025-05-22 - Northern Lights Glassmorphism for Pill Component

- **Signal:** Tag/pill badge component was visually flat and lacked interactive micro-interactions matching the Northern Lights aesthetic.
- **Action:**
  - Enhanced `.pill` in `src/components/Pill.astro` with `backdrop-filter: blur(12px) saturate(140%)` for translucent glassmorphism.
  - Implemented hardware-accelerated hover state with `translateY(-2px)` and smooth gradient shift (`background-position`).
  - Added glowing accent shadow using Northern Lights cyan tone (`hsla(210, 100%, 45%, 0.35)`).
  - Enforced `prefers-reduced-motion: reduce` query for WCAG AA compliance.
- **Tokens Added:**
  - Glass Blur: `12px saturate(140%)`
  - Affordance: `translateY(-2px)`
  - Glow: `hsla(210, 100%, 45%, 0.35)`
