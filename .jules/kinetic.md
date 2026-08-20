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

## 2025-05-22 - Glassmorphic Micro-Interactions for Portfolio Preview Cards

- **Signal:** Portfolio preview cards lacked dynamic depth and tactile visual feedback on hover/focus states.
- **Action:**
  - Added subtle image scaling (`transform: scale(1.03)`) with `cubic-bezier(0.22, 1, 0.36, 1)` smooth easing on card hover/focus.
  - Enhanced title tag background opacity and text contrast on card hover (`hsla(var(--gray-999-basis), 0.95)` and `var(--gray-0)`).
  - Aligned active hover border highlight with `--accent-regular`.
  - Added `prefers-reduced-motion: reduce` query overrides to disable scaling and translation for users with motion sensitivity.
- **Tokens Added:**
  - Micro-scale transform: `scale(1.03)`
  - Title contrast backdrop: `hsla(var(--gray-999-basis), 0.95)`
