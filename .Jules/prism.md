## 2026-03-30 - Interactive Northern Lights Canvas Laboratory

- **Canvas Memory & Performance Thresholds**:
  - Target Frame Rate: 60fps achieved on desktop with DPR scaling (capped at 2.0).
  - Garbage Collection Optimization: Reused static color tuples and pre-allocated harmonic arrays inside `requestAnimationFrame` loop to prevent per-frame dynamic object allocation.

- **Math Logic Setup**:
  - Multi-harmonic sine wave heights via `calculateRibbonY(x, width, time, harmonics)`.
  - Pointer-driven optical light refraction attenuation via `cubicSmoothstep(distance, radius)`.
  - RGB color tuple interpolation via `interpolateColor(colorA, colorB, factor)`.

- **Mobile Viewport Scaling Strategy**:
  - Automatically scales resolution (50% scale on `<480px`, 75% scale on `<768px`) and clamps wave harmonic count to 2 on mobile viewports to guarantee 60fps performance on low-power devices.
