# Prism Journal 👩‍🚀

## 2026-03-31 - Aurora Magnetosphere Laboratory

- **Garbage Collection & Memory Thresholds:**
  - Particle allocations capped dynamically at 60 (mobile <600px), 90 (tablet 600-999px), and 120 (desktop >=1000px).
  - Canvas context clears on each frame using `ctx.clearRect(0, 0, width, height)` without accumulating offscreen buffers or image contexts.
  - Teardown hooked into `astro:before-swap` explicitly cancels `requestAnimationFrame` loops and removes `resize`, `keydown`, `pointermove`, and `pointerleave` listeners to prevent leaks.
- **Math & Animation Formulas:**
  - Superposition sine wave formula: `sin(x * freq + time * speed) * A1 + sin(x * freq * 0.5 - time * speed * 0.7) * A2 + cos(x * freq * 1.5 + time * speed * 1.2) * A3`
  - Magnetosphere quadratic force displacement: `factor = Math.pow(1 - dist / maxRadius, 2) * forceStrength`
- **Mobile Adaptive Scaling:**
  - `getAdaptiveScale(screenWidth)` reduces particle count dynamically while scaling viewport canvas parameters.
