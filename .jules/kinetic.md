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

## 2025-05-22 - Immersive Image Scaling & Comprehensive Motion Accessibility

- **Signal:** Portfolio preview images were static on hover, lacking depth and premium tactile feedback. Hover/active movements on preview cards and CTAs lacked explicit `prefers-reduced-motion` safety fallbacks.
- **Action:**
  - Implemented smooth, hardware-accelerated image scaling (`transform: scale(1.05)`) on `.card:hover img` and `.card:focus-visible img` inside `src/components/PortfolioPreview.astro`.
  - Added `@media (prefers-reduced-motion: reduce)` in `PortfolioPreview.astro` to safely bypass card translation, image scaling, and shimmer sweep animations.
  - Added `@media (prefers-reduced-motion: reduce)` in `CallToAction.astro` to cleanly disable scaling and translations on hover, focus-visible, and active states.
- **Tokens Added:**
  - Interactive Zoom Scale: `scale(1.05)`
  - Motion Reduction Rule: `@media (prefers-reduced-motion: reduce)`
