## 2026-03-31 - [Aurora Wave Field Lab Canvas] | Signal: Autonomous Interactive Lab Track | Lean Implementation: Self-Contained HTML5 Canvas with Pure TS Math Utilities

- **Garbage Collection & Memory Thresholds:**
  - Zero dynamic heap allocations inside `draw()` frame loop: pre-calculated grid coordinates and reused pointer interpolation targets prevent GC stutter on 60fps canvas loop.
  - Active animation loops and window/canvas event listeners (`pointermove`, `resize`, `keydown`) bound to `astro:before-swap` for clean teardown during page transitions.

- **Math Logic Setup:**
  - `cubicSmoothstep(distance, radius)`: Implemented quadratic/cubic falloff `(1 - distance / radius)^2` for optical light refraction displacement under cursor.
  - `computeAuroraWave(x, y, time)`: Multi-harmonic wave function compounding primary sine wave, offset cosine wave, and cross-harmonic displacement.
  - `calculateAuroraColor(elevation, opacity)`: Smooth color interpolation between Marine Blue (`hsla(210, 67%, 16%, a)`) and Cyan (`hsla(183, 100%, 50%, a)`).

- **Mobile Viewport Scaling Strategy:**
  - Adaptive grid spacing (`28px` for `<480px`, `24px` for `<768px`, `20px` for desktop) scales particle density to maintain 60fps on mobile CPUs.
  - Dynamic particle radius scaling via `scaleParticleRadius()` reduces node render overhead while preserving visual clarity across high-DPI devices.
