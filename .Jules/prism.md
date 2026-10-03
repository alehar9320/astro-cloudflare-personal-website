# Prism's Creative & Interactive Journal

## 2026-03-31 - Northern Lights Canvas Lightfield & Smoothstep Refraction

### Canvas Memory & Garbage Collection Metrics
- **Dynamic Spatial Step Sampling:** Pre-calculating spatial wave intervals based on viewport width (`Math.max(4, Math.floor(viewportWidth / 120))`) eliminates per-pixel allocations during requestAnimationFrame loops.
- **GC Overhead Minimization:** Used single-pass canvas path creation (`moveTo` / `lineTo`) with direct cubic smoothstep calculation inside loop iterations, avoiding intermediate array allocations or vector object instantiations.
- **Context Teardown:** Bound `astro:before-swap` listener to cancel `requestAnimationFrame`, detach window/pointer listeners, and set `canvas.dataset.initialized = 'false'` to ensure zero memory leaks during Client-side Navigation.

### Reusable Math Logic Setups
- **Multi-harmonic Wave Superposition:** Combined primary sine wave with secondary harmonic (`Math.sin(x * freq + t * speed + phase) + 0.35 * Math.cos(x * freq * 1.5 - t * speed * 0.8 + phase)`) for natural fluid motion.
- **Cubic Smoothstep Falloff:** Displacement offset formula `(1 - distance / radius)^2` applied within threshold radius provided fluid light refraction without external physics engines or heavy overhead.

### Mobile Viewport Scaling Strategies
- **Device Pixel Ratio Cap:** Capped `dpr = Math.min(window.devicePixelRatio || 1, 2)` to prevent excessive canvas buffer dimensions on high-DPI mobile devices (3x/4x DPR screens).
- **Reduced Motion & Pause Controls:** Defaulted to paused static rendering when `prefers-reduced-motion: reduce` is detected; provided full keyboard-accessible controls (`aria-pressed`, `aria-label`) for play/pause toggle.
