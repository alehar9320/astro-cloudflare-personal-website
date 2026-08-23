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

## 2025-05-22 - Refined CallToAction Glassmorphism & Micro-Interactions

- **Signal:** Primary call-to-action buttons lacked glassmorphic depth and border highlight affordance.
- **Action:**
  - Upgraded `src/components/CallToAction.astro` with scoped `--cta-glow-color` and `--cta-border-light` custom properties.
  - Added `backdrop-filter: blur(12px)` and top sheen gradient overlay with `mix-blend-mode: overlay`.
  - Polished hover/focus-visible border state with `hsla(0, 0%, 100%, 0.45)` for high tactile affordance while preserving `prefers-reduced-motion` safety.
- **Tokens Added:**
  - CTA Glow: `hsla(210, 100%, 50%, 0.6)`
  - Border Light: `hsla(0, 0%, 100%, 0.25)` -> Hover `hsla(0, 0%, 100%, 0.45)`
  - Sheen Overlay: `linear-gradient(180deg, hsla(0, 0%, 100%, 0.2) 0%, transparent 50%)`
