# Prism Journal

## 2025-02-18 - Northern Lights Wave Refraction Canvas

### Math Logic Setup
- **Multi-Frequency Sine Wave Synthesis**: Wave heights are dynamically evaluated using `calculateWaveY(x, time, WaveParams) = verticalOffset + Math.sin(x * frequency + time * speed + phaseShift) * amplitude`.
- **Interactive Cursor Refraction**: `calculateRefractionOffset` applies an inverse linear distance displacement factor within a 160px interaction radius, allowing user mouse or touch input to warp wave vertices smoothly without array mutations or physics engine overhead.

### Viewport Scaling & Performance Thresholds
- **Dynamic Spatial Step Sampling**: `getSpatialStep(viewportWidth) = Math.max(4, Math.floor(viewportWidth / 120))` reduces vertex evaluation loops on high-resolution widescreen monitors (e.g., step size 16 at 1920px) while maintaining smooth 60fps frame rates on narrow mobile viewports (step size 4 at 320px).
- **Device Pixel Ratio Cap**: Canvas internal dimensions scale with `Math.min(window.devicePixelRatio || 1, 2)` to prevent excessive VRAM allocation on 3x Retina displays.

### Garbage Collection Metrics & Memory Lifecycle
- **Zero Allocations in Render Loop**: Wave parameters are stored in static structures and recycled across frame draws.
- **Teardown & Pause Guards**:
  - `astro:before-swap`: Clears `requestAnimationFrame` loop, resets `canvas.dataset.initialized = 'false'`, and removes global resize and visibility listeners.
  - `visibilitychange`: Cancels frame requests when `document.hidden` is true, eliminating CPU/GPU consumption in background tabs.
  - `prefers-reduced-motion`: Respects system motion preferences by rendering a single static frame and disabling frame loops.
