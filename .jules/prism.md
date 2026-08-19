# Prism Journal 👩‍🚀

## 2025-08-19 - Northern Lights Aurora Refractor Canvas

- **Garbage Collection & Memory Thresholds:**
  - Double-buffered linear canvas scale capped at `Math.min(window.devicePixelRatio, 2)` to constrain memory footprint < 12MB on Retina viewports.
  - Lifecycle listeners (`resize`, `mousemove`, `touchmove`, `keydown`) and `requestAnimationFrame` IDs are bound with explicit teardown in Astro `astro:before-swap` listener to eliminate memory leaks upon client navigation.

- **Mathematical Logic Configurations:**
  - **Sine Wave Superposition:** Multi-layered wave rendering using `calculateSineSuperposition(x, t, freq, amp)` combining 3 harmonic sine/cosine phases: `wave1 = sin(x * f + t * 0.8) * A`, `wave2 = sin(x * f * 2.3 + t * 1.2) * 0.45A`, `wave3 = cos(x * f * 0.7 - t * 0.5) * 0.25A`.
  - **Magnetosphere Vector Displacement:** Inverse-square falloff vector interaction computed via `calculateMagnetosphereVector`: `influence = (1 - dist / maxRadius)^2` pushing/pulling wave nodes dynamically towards cursor coordinates.

- **Frame-Rate & Mobile Scale Strategies:**
  - Maintains consistent 60fps across desktop and mobile devices.
  - Adaptive horizontal step resolution (`stepX = Math.max(6, Math.floor(width / 120))`) automatically reduces vertex evaluation count on narrow mobile viewports.
  - Honors `prefers-reduced-motion: reduce` media query by pausing animation loop upon load while maintaining static color refractions.
