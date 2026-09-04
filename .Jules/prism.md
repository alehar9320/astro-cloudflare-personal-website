## 2026-03-30 - Interactive Aurora Wave & Light Refraction Mesh (Lab Experiment)

- **Garbage Collection & Memory Thresholds**:
  - Bound pointer event handlers and animation loop frames within strict component scope.
  - Enforced `astro:before-swap` cleanup listener with `{ once: true }` to cancel `requestAnimationFrame`, remove resize/pointer listeners, and release 2D rendering context allocations during client-side navigation.
  - Zero dynamic array allocations inside the 60fps render loop; primitive scalar math used for vector displacements.

- **Math & Physics Logic Setup**:
  - Implemented dual-harmonic sine wave equation (`calculateHarmonicWave`) combined with light 2D pseudo-simplex gradient noise (`pseudoNoise2D`) in pure TypeScript (`src/utils/aurora-math.ts`).
  - Pointer refraction field (`calculatePointerRefraction`) applies quadratic falloff displacement vectors ($intensity = (1 - d/r)^2$) within touch/pointer radius.
  - Custom palette interpolator (`interpolateAuroraColor`) supporting smooth RGBA transitions between 'Marine', 'Emerald', and 'Arctic' Northern Lights themes.

- **Mobile Viewport & Accessibility Scaling**:
  - Automatically downscales wave count (from 7 to 4) and horizontal step size (from 8px to 12px) on mobile viewports (<640px) to guarantee 60fps across lower-power hardware.
  - Built-in `@media (prefers-reduced-motion: reduce)` media query detection that automatically pauses continuous animation loops and renders static single-frame canvas states.
