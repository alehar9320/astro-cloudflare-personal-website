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

## 2025-05-22 - Interactive Glassmorphic Affordance for Pill Component

- **Signal:** Tag and category pills lacked visual depth, hover affordance, and tactile press states.
- **Action:**
  - Added `backdrop-filter: blur(12px) saturate(140%)` to `src/components/Pill.astro` for frosted glass transparency.
  - Implemented smooth hardware-accelerated hover translation (`translateY(-2px)`) with "Northern Lights" cyan glow (`hsla(210, 100%, 45%, 0.35)`).
  - Added active tactile compression state (`scale(0.96)`) and explicit `:focus-visible` outlines.
  - Enforced `prefers-reduced-motion` safety query to disable transforms when requested.
- **Tokens Added:**
  - Pill Glass Blur: `12px`
  - Pill Hover Affordance: `translateY(-2px)`
  - Pill Cyan Glow: `hsla(210, 100%, 45%, 0.35)`
  - Tactile Compression: `scale(0.96)`
