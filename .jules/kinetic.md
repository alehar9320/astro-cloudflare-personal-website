# Kinetic Journal ⚡

## 2026-08-21 - Glassmorphic Interactive Pill Micro-Interactions

- **Signal:** Pill component lacked glassmorphic depth and interactive affordance when hovering over project tags.
- **Action:**
  - Added `backdrop-filter: blur(12px)` and `-webkit-backdrop-filter` for glassmorphic depth.
  - Added hardware-accelerated hover transition (`translateY(-2px)`) and background position shift for animated gradient effect.
  - Aligned hover glow shadow with "Northern Lights" cyan theme using `hsla(210, 100%, 45%, 0.35)`.
  - Enforced `prefers-reduced-motion` safety to disable transforms for users preferring reduced motion.
- **Tokens Added:**
  - Glass Blur: `12px`
  - Affordance: `translateY(-2px)`
  - Glow: `hsla(210, 100%, 45%, 0.35)`

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
