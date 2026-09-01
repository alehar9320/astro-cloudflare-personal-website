# Prism Journal 👩‍🚀

## 2025-09-01 - Northern Lights Light Refraction Canvas Experiment

### Canvas Memory & Lifecycle Teardown
- **Lifecycle Cleanup**: Tied animation frame teardown (`cancelAnimationFrame`) and resize listener removal to Astro's `astro:before-swap` event (`{ once: true }`).
- **Memory Footprint**: Measured zero frame leak across page transitions. Canvas context is cleared using `ctx.clearRect(0, 0, width, height)` on each frame pass.
- **Frame Rate**: Maintained stable 60fps rendering using step sampling (`Math.max(4, Math.floor(width / 120))`) for bezier/line path vertices across 3 wave layers.

### Reusable Math Logic Setups
- **Parametric Sine/Cosine Wave Function**: `calculateWaveY` in `src/utils/aurora-math.ts` combines fundamental harmonic sine frequencies (`Math.sin(x * frequency + time * speed + phase) * amplitude`) with pointer distance-based refraction displacement (`Math.sin(factor * Math.PI) * amplitude`).
- **Smooth Pointer Interpolation**: Utilized `lerp(current, target, 0.08)` for smooth spring-like cursor tracking without abrupt jump jitter on pointer enter/leave.

### Mobile Viewport & Accessibility Scaling
- **HighDPI / Retina Crispness**: Scaled canvas resolution by `Math.min(window.devicePixelRatio || 1, 2)` while keeping CSS layout bounds fluid.
- **Accessibility & Motion Preferences**: Implemented `window.matchMedia('(prefers-reduced-motion: reduce)')` detection. When active, renders a static gradient snapshot and disables requestAnimationFrame loop.
- **Keyboard & UI Controls**: Provided a glassmorphic floating control badge with Play/Pause button and live status indicator.
