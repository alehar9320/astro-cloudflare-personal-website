## 2026-03-30 - Interactive Northern Lights Refraction Canvas

### Canvas Memory & Frame-rate Metrics
- **Canvas Resolution:** Device Pixel Ratio scaled up to `Math.min(window.devicePixelRatio, 2)`. Memory footprint is capped under ~2MB VRAM per canvas instance.
- **Garbage Collection Optimization:** Reused single static `PointerState` object (`pointer`) and array allocations. Wave point calculations perform inline scalar operations to avoid object allocations in 60fps render loops.
- **Animation Loop Cleanup:** Bound to `astro:before-swap` and `visibilitychange`. When the document is hidden (`document.hidden`), `requestAnimationFrame` is paused to eliminate background CPU/GPU load.

### Reusable Math Logic Setups
- **Cubic Smoothstep Attenuation:** `cubicSmoothstep(distance, radius)` computes `(1 - distance / radius)^2` for `[0, radius]`, providing fluid optical light displacement around user interaction points.
- **Sinusoidal Vector Wave Calculation:** `calculateWaveY(x, time, config, pointer, pointerRadius)` combines layered sine wave motion with smooth pointer displacement. Located in `src/utils/aurora-math.ts`.

### Viewport & Mobile Scaling Strategies
- **Dynamic Sampling Step:** Render step automatically scales to `8px` on mobile viewports (`width < 768px`) vs `4px` on desktop viewports, maintaining rock-solid 60fps on mobile/low-power hardware.
- **Accessibility Safeguard:** Evaluates `@media (prefers-reduced-motion: reduce)` to disable canvas animation loops for users with motion sensitivity.
