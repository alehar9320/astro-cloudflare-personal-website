# Kinetic Journal ⚡

## 2025-05-15 - Interactive Glassmorphism for Skills Section

- **Signal:** Standardized skills box lacked interactive affordance and depth.
- **Action:**
  - Upgraded `.box` in `src/components/Skills.astro` with `backdrop-filter: blur(16px)` for enhanced glassmorphism.
  - Implemented hardware-accelerated hover state with `translateY(-4px)` for better visual hierarchy.
  - Aligned hover shadow with "Northern Lights" palette using `hsla(210, 100%, 45%, 0.3)`.
  - Added `prefers-reduced-motion` safety for accessibility.

## 2025-05-22 - Ambient Northern Lights Shimmer for Pills

- **Signal:** Pills used for roles and tags were static, lacking the "Northern Lights" immersive feel.
- **Action:**
  - Introduced `enable_pill_shimmer_v1` feature flag for controlled rollout.
  - Implemented `background-sweep` animation (8s linear infinite) on Pills for ambient motion.
  - Added interactive scale-up (`1.02`) and cyan glow (`0 0 15px hsla(210, 100%, 45%, 0.4)`) on hover/focus.
  - Ensured WCAG compliance with `prefers-reduced-motion` media query and `:focus-within` support.
- **Tokens Added:**
  - Glass Blur: `16px`
  - Affordance: `translateY(-4px)`
  - Glow: `hsla(210, 100%, 45%, 0.3)`
  - Pill Ambient Animation: `background-sweep 8s linear infinite`
  - Pill Hover Glow: `0 0 15px hsla(210, 100%, 45%, 0.4)`
