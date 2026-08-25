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

## 2025-05-22 - Glassmorphic Edge Highlight & Elevation Upgrade for Portfolio Cards

- **Signal:** Portfolio preview cards lacked cohesive specular edge lighting and reduced-transparency fallbacks.
- **Action:**
  - Upgraded `.card` in `src/components/PortfolioPreview.astro` with scoped custom CSS tokens (`--card-glow-cyan`, `--card-border-light`).
  - Added cyan specular edge highlight on hover/focus-visible via hardware-accelerated dual-shadowing (`0 0 0 1px hsla(190, 100%, 50%, 0.25)`).
  - Implemented `prefers-reduced-transparency` fallback to solid background colors and disabled backdrop filters.
  - Extended `prefers-reduced-motion` safeguards across all active/shimmer states.
- **Tokens Added:**
  - Scoped Cyan Glow: `hsla(210, 100%, 50%, 0.35)`
  - Specular Edge Ring: `0 0 0 1px hsla(190, 100%, 50%, 0.25)`
  - Scoped Card Border: `hsla(var(--gray-999-basis), 0.2)`
