# Kinetic Journal ⚡

## 2025-05-22 - Glassmorphic Depth & Interactive Micro-States for CallToAction

- **Signal:** Primary CallToAction button lacked ambient glassmorphic refraction depth and micro-interaction states consistent with the Northern Lights visual identity.
- **Action:**
  - Upgraded `src/components/CallToAction.astro` styling with component-scoped tokens (`--cta-glow-color`, `--cta-border-color`).
  - Added backdrop filter blur (`backdrop-filter: blur(12px) saturate(140%)`) and border contrast.
  - Implemented hardware-accelerated hover transition (`translateY(-2px)`) with cubic-bezier timing (`cubic-bezier(0.22, 1, 0.36, 1)`).
  - Maintained accessibility through `focus-visible` ring outlines and `prefers-reduced-motion` fallbacks.
- **Tokens Added:**
  - Glow Color: `hsla(210, 100%, 45%, 0.35)`
  - Border Basis: `hsla(var(--gray-999-basis), 0.2)`

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
