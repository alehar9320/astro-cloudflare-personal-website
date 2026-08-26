# Kinetic Journal ⚡

## 2026-08-26 - Hardware-Accelerated Portfolio Card Image Zoom

- **Signal:** Portfolio preview cards lacked internal visual depth during hover and focus interactions.
- **Action:**
  - Enhanced `src/components/PortfolioPreview.astro` card image with smooth `transform: scale(1.04)` transition on hover and focus-visible.
  - Used hardware-accelerated `transform` with a smooth `cubic-bezier(0.22, 1, 0.36, 1)` timing function.
  - Wrapped hover/focus scale effect in `@media (prefers-reduced-motion: no-preference)` for accessibility compliance.
- **Tokens Added:**
  - Card Image Hover Zoom: `scale(1.04)` with `cubic-bezier(0.22, 1, 0.36, 1)`

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
