## 2026-03-29 - Interactive Northern Lights Wavefront Canvas

### Garbage Collection & Memory Thresholds
- **DPR Capping:** Integrated `clampDevicePixelRatio(window.devicePixelRatio, 2)` to cap HTML5 Canvas resolution at 2x on high-DPI displays. Prevents excessive allocation of GPU memory buffers on Retina/4K viewports while preserving crisp visual rendering.
- **Lifecycle Teardown:** Bound cleanup logic (`cancelAnimationFrame`, `removeEventListener` for resize, pointermove, and pointerleave) directly to Astro's `astro:before-swap` event with `{ once: true }`. Guarantees complete teardown and prevents background memory leaks during client-side navigation.

### Reusable Math Formulas
- **Harmonic Wave Superposition (`calculateHarmonicWave`):** Combines three out-of-phase sine/cosine frequencies ($f, 2.3f, 0.7f$) with scaled amplitudes ($A, 0.4A, 0.25A$) to render organic, fluid Northern Lights visual ribbons without third-party dependencies.
- **Exponential Coordinate Interpolation (`lerp`):** Smoothly interpolates active pointer coordinates ($t = 0.08$) to model organic fluid inertia when refracting waves.

### Viewport & Accessibility Scaling
- **Mobile Viewport Scaling:** Dynamic canvas dimension recalculation relative to container `clientWidth` and `clientHeight` with CSS `touch-action: none` for smooth touch interactions on mobile screens.
- **Prefers-Reduced-Motion Compliance:** Listens to `window.matchMedia('(prefers-reduced-motion: reduce)')`. When active, freezes the time delta (`waveTime = 0`), renders a single static wave state, and skips initiating the `requestAnimationFrame` render loop.
