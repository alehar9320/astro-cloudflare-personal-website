# Kinetic Journal ⚡

## 2025-05-15 - Interactive Glassmorphism for Skills Section

- **Signal:** Standardized skills box lacked interactive affordance and depth.
- **Action:**
  - Upgraded `.box` in `src/components/Skills.astro` with `backdrop-filter: blur(16px)` for enhanced glassmorphism.
  - Implemented hardware-accelerated hover state with `translateY(-4px)` for better visual hierarchy.
  - Aligned hover shadow with "Northern Lights" palette using `hsla(210, 100%, 45%, 0.3)`.
  - Added `prefers-reduced-motion` safety for accessibility.
- **2025-05-22 - Enhanced Glassmorphism & Kinetic Gradients**
  - **Signal:** Mention cards in the landing page lacked depth and interactive engagement compared to other components.
  - **Action:**
    - Upgraded `.mention-card` in `src/pages/index.astro` with `backdrop-filter: blur(12px)` and translucent `hsla` background.
    - Implemented high-performance lift (`translateY(-4px)`) and scale (`scale(1.02)`) on hover/focus.
    - Added "Northern Lights" glow to mention cards for consistent visual language.
    - Introduced a subtle, slow `gradient-shift` animation (8s linear) to `src/components/Pill.astro` to provide a "living" UI feel.
  - **Tokens Added:**
    - Kinetic Animation: `gradient-shift 8s linear infinite`
    - Scale Affordance: `scale(1.02)`
    - Mention Glass: `blur(12px)`
    - Glass Blur (Skills): `16px`
    - Affordance (Skills): `translateY(-4px)`
    - Glow: `hsla(210, 100%, 45%, 0.3)`
