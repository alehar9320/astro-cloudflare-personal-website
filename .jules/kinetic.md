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

## 2025-05-22 - Strategic UI Polish: Interactive Pills & Glassmorphic Mention Cards

- **Signal:** Pills and Mention Cards lacked sufficient interactive depth and alignment with the high-end glassmorphic aesthetic.
- **Action:**
  - Upgraded `src/components/Pill.astro` with hardware-accelerated hover/active states. Added a 2px vertical lift and a blue glow (`hsla(210, 100%, 50%, 0.5)`) on hover.
  - Refactored `.mention-card` in `src/pages/index.astro` from a static gradient to a glassmorphic surface (`backdrop-filter: blur(12px)`) with a subtle 4px lift and themed border on hover.
  - Implemented `prefers-reduced-motion` safeguards for all new transitions.
- **Tokens Added:**
  - Pill Glow: `hsla(210, 100%, 50%, 0.5)`
  - Mention Card Blur: `12px`
  - Mention Card lift: `translateY(-4px)`
