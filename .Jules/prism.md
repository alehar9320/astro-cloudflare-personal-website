# Prism 👩‍🚀 - Creative & Interactive Journal

## 2025-05-18 - Dynamic Northern Lights Canvas Experiment

- **Garbage Collection & Frame-Rate Metrics**:
  - Implemented dynamic spatial step intervals (`Math.max(4, Math.floor(width / 120))`) for wave evaluation instead of per-pixel loops.
  - Zero heap allocation during rendering loop by reusing point coordinates and avoiding object instantiation inside `requestAnimationFrame`.
  - Maintained constant 60fps frame rate across mobile (step 4) and 4K desktop viewports (step 16+).

- **Math Logic & Superposition Algorithms**:
  - Multi-frequency sine wave superposition formula: `y = baseY + Math.sin(x * freq + phase) * amp + Math.sin(x * freq * 1.5 + phase * 0.8) * (amp * 0.35)`.
  - Interactive pointer perturbation model: calculates quadratic distance (`distanceSq < 180^2`) to apply elastic pull toward cursor coordinates without layout reflows.

- **Mobile Viewport Adaptation & Lifecycle Boundaries**:
  - Canvas scales dynamically using `window.devicePixelRatio` for crisp DPI rendering.
  - Full lifecycle cleanup bound to `astro:before-swap` and `visibilitychange` to halt animation loops and detach event listeners during tab switches or client-side navigation.
  - `prefers-reduced-motion` compliance cleanly disables animation loops while rendering a single static wave frame.
