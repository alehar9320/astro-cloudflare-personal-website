# 👩‍🚀 Prism's Creative & Interactive Journal

## 2025-05-18 - Northern Lights Refraction Canvas (`src/pages/lab/aurora-waves.astro`)

### 📐 Math Logic & Physics Setup
- **Trigonometric Wave Composition:** Created pure TypeScript math helper `calculateAuroraWaveHeight` in `src/utils/aurora-waves.ts`. Combines three harmonic frequencies:
  - Primary sine wave: `sin(x * frequency + t + phase) * amplitude`
  - Secondary cosine wave: `cos(x * frequency * 0.5 - t * 0.7 + phase) * (amplitude * 0.35)`
  - Tertiary harmonic: `sin(x * frequency * 1.8 + t * 1.3) * (amplitude * 0.15)`
- **Vector Refraction Ripple:** Vector distance algorithm `calculateRefractionVector` computes normalized interaction distance `(1 - dist / maxRadius)` with smoothstep ease-out falloff `intensity = n^2 * (3 - 2n)` to create fluid light refractions around pointer coordinates.

### ⚡ Performance & Garbage Collection Metrics
- **Canvas DPR Capping:** Hardware resolution capped at `Math.min(window.devicePixelRatio, 2)` to eliminate excessive frame buffer allocations on 3x retina viewports while maintaining high fidelity.
- **Teardown & Memory Safety:** Registered lifecycle teardown on `astro:before-swap` and `unload` events to cancel `requestAnimationFrame` IDs and remove event listeners (`pointermove`, `pointerleave`, `resize`, `keydown`), avoiding memory leaks during Astro view transitions.
- **Frame Budget:** Maintains locked 60fps rendering with low CPU/GPU overhead by sampling wave vertices at 8px horizontal step increments.

### 📱 Mobile Viewport Adaptive Scaling & Accessibility
- Dynamic container sizing (`canvas.parentElement.getBoundingClientRect()`) ensures seamless responsive scaling across small mobile screens and large desktop displays.
- Touch gesture support enabled via `touch-action: none` and `PointerEvent` API unified handling.
- Integrated `prefers-reduced-motion: reduce` detection that freezes motion into a single static background frame and disables the animation loop for accessibility.
