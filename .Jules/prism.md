# 👩‍🚀 Prism Journal

## 2026-03-31 - Northern Lights Interactive Refraction Canvas Lab

### Garbage Collection & Memory Thresholds
- **DPR Cap**: Capped device pixel ratio at `clampDpr = Math.min(Math.max(dpr, 1), 2)` to constrain render buffer memory on high-density displays (e.g. 3x Retina viewports).
- **Lifecycle Teardown**: Registered `{ once: true }` listener for `astro:before-swap` to explicitly invoke `cancelAnimationFrame` and unbind window `resize`, `mousemove`, and `touchmove` listeners, eliminating memory leak risks during client-side page transitions.

### Reusable Math & Physics Setups (`src/utils/aurora-math.ts`)
- **Compound Harmonic Wave Motion**: `calculateHarmonicWave(x, time, wavelength, amplitude, speed)` uses three stacked sine/cosine harmonics ($f_1, 2.1f_1, 0.5f_1$) to synthesize realistic organic fluid dynamics.
- **Vector Pointer Attraction**: `calculateVectorAttraction(currentPos, targetPos, attractionFactor, maxSpeed)` implements smooth critically damped cursor/touch tracking capped by max velocity to avoid velocity spikes.

### Mobile Viewport Scaling Strategy
- Adaptive CSS aspect-ratio container (`height: 420px` desktop / `300px` mobile) recalculates native canvas pixel resolution on `resize` events while maintaining CSS display bounds.
- Added `@media (prefers-reduced-motion: reduce)` media query check in JS runtime to automatically default the engine to a static frame snapshot while preserving accessibility controls.
