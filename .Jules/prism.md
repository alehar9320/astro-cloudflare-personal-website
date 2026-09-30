# Prism 👩‍🚀 — Creative & Interactive Development Journal

## 2026-03-30 — Aurora Canvas Light Refraction Laboratory

### Math Logic Setup
- **Multi-Layered Sine Wave Physics**: Computed vertical wave offset using `calculateWaveY(x, time, amplitude, frequency, phase, baseOffset)` with 3 overlapping bands (frequencies 0.008 - 0.005, amplitudes 22px - 46px).
- **Cubic Smoothstep Falloff**: Applied attenuation `(1 - distance / radius)^2` via `cubicSmoothstep(distance, radius)` to displace wave coordinates dynamically relative to pointer interaction without high GC overhead or external physics libraries.
- **Color Interpolation**: Blended palette keyframes across Northern Lights aesthetic (`#091E3A` Marine Blue -> `#005C8A` Deep Teal -> `#00F2FE` Vibrant Cyan) via `interpolateAuroraColor(factor)`.

### Memory Safety & Garbage Collection
- **Zero GC Allocation in Render Loop**: Avoided array/object allocations inside `requestAnimationFrame` loop. Segment points are computed dynamically and fed straight into `ctx.lineTo()`.
- **Lifecycle Cleanup**: Enforced initialization guard `canvas.dataset.initialized === 'true'`, and attached teardown listener on `astro:before-swap` to cancel `requestAnimationFrame`, detach listeners, and reset dataset flag.
- **Background Pause**: Listened to `document.visibilitychange` to suspend animation loops when `document.hidden` is true, keeping main thread idle when switching browser tabs.

### Viewport & Mobile Scaling Strategy
- **Device Pixel Ratio Cap**: Dynamic canvas scaling capped at `min(window.devicePixelRatio, 2)` to preserve crisp rendering on high-DPI displays while maintaining 60fps frame rate targets.
- **CSS Touch Action**: Applied `touch-action: none` to canvas container to prevent scroll conflict during touch interaction.
- **Reduced Motion Fallback**: Honored `@media (prefers-reduced-motion: reduce)` via `window.matchMedia` check by rendering a static frame and skipping the animation loop.
