# Kinetic Journal ⚡

## 2025-05-20 - Northern Lights Soothing Ambient Background

- **Signal:** Need subtle background ambience ("Northern Lights") behind content across pages while preserving high content contrast and full reduced-motion support.
- **Action:**
  - Added `<div class="aurora-bg" aria-hidden="true">` with three blurred glow nodes (`glow-1`, `glow-2`, `glow-3`) into `src/layouts/BaseLayout.astro`.
  - Configured radial gradients in marine blue, cyan, emerald, and violet tailored for light/dark themes.
  - Used hardware-accelerated 3D transform keyframe animations (`will-change: transform`, `translate3d`, `scale`, `rotate`) with long periods (22s–28s) to maintain a smooth 60fps ambient wash.
  - Enforced `prefers-reduced-motion: reduce` disabling animations (`animation: none`) to present a quiet, static gradient wash behind content.
- **Tokens/Snippets Added:**
  - Ambient Wash Keyframes: `aurora-move-1`, `aurora-move-2`, `aurora-move-3`
  - Glow blur: `filter: blur(80px)`
  - Accessibility Gate: `@media (prefers-reduced-motion: reduce)`

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
