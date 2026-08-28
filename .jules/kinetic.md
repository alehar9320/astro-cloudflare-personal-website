# Kinetic Journal ⚡

## 2025-05-22 - Portfolio Card Image Zoom & Accessibility Upgrade

- **Signal:** Portfolio preview card images lacked dynamic visual affordance on card hover/focus.
- **Action:**
  - Enhanced `src/components/PortfolioPreview.astro` with hardware-accelerated `transform: scale(1.04)` transition on `.card:hover img` and `.card:focus-visible img`.
  - Added `@media (prefers-reduced-motion: reduce)` rules to disable card translation, image zoom, and shimmer keyframe animations.
- **Tokens Added:**
  - Image Zoom Scale: `scale(1.04)`
  - Transition Easing: `cubic-bezier(0.22, 1, 0.36, 1)`

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
