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

## 2025-05-22 - Enhanced Glassmorphism for Mention Cards

- **Signal:** Mention cards used standard gradients, lacking the high-polish glassmorphic depth found in other portfolio sections.
- **Action:**
  - Upgraded `.mention-card` in `src/pages/index.astro` with `backdrop-filter: blur(16px)` and `-webkit-backdrop-filter` for Safari support.
  - Replaced `var(--gradient-subtle)` with `hsla(var(--gray-999-basis), 0.05)` to emphasize transparency.
  - Implemented fluid `cubic-bezier(0.22, 1, 0.36, 1)` transitions for 0.4s across transform, box-shadow, and background-color.
  - Enhanced interactive affordance with `translateY(-4px)` and a themed "Northern Lights" glow shadow (`hsla(210, 100%, 45%, 0.3)`).
  - Ensured WCAG compliance via `prefers-reduced-motion: reduce` overrides.
- **Tokens Added:**
  - Card Glass Layer: `hsla(var(--gray-999-basis), 0.05)`
  - Hover Opacity: `hsla(var(--gray-999-basis), 0.1)`
  - Fluid Easing: `cubic-bezier(0.22, 1, 0.36, 1)`
