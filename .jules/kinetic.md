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

## 2025-05-22 - Glassmorphic Hero Refinement & Staggered Animations

- **Signal:** Hero section lacked entrance dynamism; "mention-cards" lacked consistent glassmorphic depth and tactile feedback.
- **Action:**
  - Refactored `mention-card` in `src/pages/index.astro` with `backdrop-filter: blur(12px)` and `hsla(var(--gray-999-basis), 0.3)` background for "Northern Lights" depth.
  - Implemented staggered `fade-in-up` entrance animations for Hero roles using `:nth-child` CSS delays (covering up to 5 children for scalability).
  - Added tactile feedback to interactive cards using design system tokens: `var(--accent-subtle-overlay)` on hover and `var(--accent-overlay)` on active states.
  - Integrated `prefers-reduced-motion` to skip animations for sensitive users.
- **Tokens Added:**
  - Stagger Delay: `100ms` increments (CSS `:nth-child` selectors).
  - Component Glow: `var(--accent-overlay)`.
  - Animation Duration: `0.6s` with `cubic-bezier(0.22, 1, 0.36, 1)`.
