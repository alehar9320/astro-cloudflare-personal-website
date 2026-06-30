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

## 2026-06-12 - Upgrade Mention Cards with Interactive Glassmorphism

- **Signal:** Mention cards in the home page lacked the depth and interactivity present in other portfolio elements.
- **Action:**
  - Upgraded `.mention-card` in `src/pages/index.astro` with `backdrop-filter: blur(16px) saturate(120%)` and a translucent `hsla(var(--gray-999-basis), 0.4)` background.
  - Enhanced hover/focus state with `translateY(-4px)` and a themed marine blue glow (`hsla(210, 100%, 45%, 0.3)`).
  - Standardized border color on hover to `var(--accent-regular)`.
  - Implemented `prefers-reduced-motion` safety for accessibility.
- **Tokens Added:**
  - Glass Blur: `16px`
  - Affordance: `translateY(-4px)`
  - Glow: `hsla(210, 100%, 45%, 0.3)`
