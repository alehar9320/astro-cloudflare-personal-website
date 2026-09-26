## 2026-03-30 - Interactive Northern Lights Aurora Waves Canvas Showcase

- **Garbage Collection Metrics & Memory Thresholds**:
  - Device Pixel Ratio (DPR) capped at `Math.min(window.devicePixelRatio || 1, 2)` to eliminate excessive off-screen buffer allocations on High-DPI / Retina screens.
  - Render loop runs with zero object allocations per frame; trigonometric calculations and RGB color conversions operate directly with scalar primitives.
  - All event listeners (`resize`, `pointermove`, `pointerleave`, `visibilitychange`, `change`) and `requestAnimationFrame` loops cleanly destroyed on Astro's `astro:before-swap` page transition event.

- **Math Logic Setups**:
  - Superimposed multi-harmonic trigonometric wave function: `amplitude * (Math.sin(x * frequency + time + phase) + 0.5 * Math.sin(x * frequency * 2.1 - time * 0.8 + phase * 1.5))`.
  - Cubic smoothstep attenuation for optical light wave distortion: `(1 - distance / radius)^2` for smooth pointer displacement without external physics dependencies.
  - Pure RGB interpolation along Northern Lights gradient stops (Marine Blue `#0284c7` -> Cyan `#06b6d4` -> Emerald `#10b981`).

- **Mobile Viewport Scaling Strategies**:
  - Adaptive resolution step scaling: Automatically switches from 4px horizontal step (5 wave layers) on desktop to 8px horizontal step (3 wave layers) on viewports `< 768px`.
  - Reduces vertex rendering load by over 60% on low-power mobile devices to guarantee 60fps frame rate budget.
