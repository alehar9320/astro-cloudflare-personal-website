## 2026-10-24 - Northern Lights Interactive Canvas Lab | Signal: Laboratory Interactive Canvas | Lean Implementation: Dynamic Spatial Sampling & Lifecycle Teardown

- **Garbage Collection & Frame Rate Thresholds:**
  - Implemented dynamic spatial step sampling (`calculateStepInterval(width) = Math.max(4, Math.floor(w / 120))`) to bound vertices evaluated per frame.
  - Device pixel ratio capped at `Math.min(window.devicePixelRatio || 1, 2)` to avoid extreme memory allocation on high-DPI displays.
  - Achieves stable 60 FPS across desktop and mobile viewports with zero object allocation during the rendering loop.

- **Reusable Math & Physics Setup:**
  - `calculateWaveY`: Pure sine wave spatial rendering with configurable frequency, phase, and base height offset (`src/utils/aurora-math.ts`).
  - `calculateParticleAttraction`: Inverse quadratic vector offset for mouse/touch refraction within `maxRadius`.
  - Comprehensive Vitest unit tests in `src/__tests__/lab-aurora-math.test.ts`.

- **Mobile Adaptation & Lifecycle Safety:**
  - `prefers-reduced-motion` media query detection automatically defaults canvas rendering to paused/static state for accessibility.
  - Event listeners on `visibilitychange` freeze the `requestAnimationFrame` loop when tab is backgrounded.
  - Clean teardown on `astro:before-swap` eliminates memory leaks during client-side navigation transitions.
