## 2026-08-28 - Northern Lights Aurora Refraction Canvas

- **Garbage Collection & Memory Thresholds:**
  - Standardized 2D canvas context teardown on Astro transition (`astro:before-swap`).
  - Capped canvas DPR scaling at `Math.min(devicePixelRatio, 2)` to constrain memory usage on high-DPI displays (< 12MB VRAM overhead).
  - Maintains a constant 60fps frame rate with zero memory allocation inside `requestAnimationFrame` loop.

- **Math Logic Setup (Wave Superposition & Magnetosphere Vector Displacement):**
  - Multi-harmonic sine wave superposition formula:
    `y = baseY + sin(x * freq + t * speed) * amp + sin(x * freq * harmonic - t * speed * 0.7) * (amp * 0.35)`
  - Pointer magnetosphere vector displacement formula:
    Displaces canvas coordinates radially around pointer position within radius `R = 160px` with smooth inverse-falloff displacement `factor = (1 - dist / R) * maxDisplacement`.

- **Mobile Viewport Adaptive Scaling:**
  - Dynamic bounding client rect measurement on `resize` event.
  - Automatically respects `prefers-reduced-motion` media query by pausing animation loops by default while providing interactive play/pause controls.
