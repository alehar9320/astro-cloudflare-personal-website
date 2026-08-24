# Kinetic Journal ⚡

## 2026-08-24 - Glassmorphic Hover & Depth for ContactCTA

- **Signal:** `ContactCTA` footer block lacked focus-within affordance and subtle glass glow interactive feedback.
- **Action:**
  - Enhanced `ContactCTA.astro` wrapper with hardware-accelerated subtle `translateY(-2px)` elevation on `:hover` and `:focus-within`.
  - Added smooth transition for border opacity, background tint, and glass elevation shadow (`hsla(210, 100%, 45%, 0.15)`).
  - Ensured WCAG compliance with focus-within ring and `prefers-reduced-motion` safety.
- **Tokens Added:**
  - ContactCTA Hover/Focus Elevation: `translateY(-2px)`
  - Glass Shadow Glow: `0 8px 30px hsla(210, 100%, 45%, 0.15)`

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
