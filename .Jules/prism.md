## 2025-05-18 - Northern Lights Aurora Refraction Canvas | Signal: Interactive Spatial Canvas | Lean Implementation: Pure TS Wave Superposition & Glassmorphic Refraction Canvas

### Math Logic & Wave Superposition
- Engineered `calculateAuroraWave(x, time, params)` in `src/utils/aurora-math.ts` using 3-harmonic sine wave superposition.
- Implemented `refractColor(normalizedDisplacement, alpha)` interpolating dynamically between Northern Lights Marine Blue (`rgb(10, 25, 47)`) and Cyan Glow (`rgb(0, 242, 254)`).

### Performance Metrics & Memory Thresholds
- **Zero Allocations in RAF Loop:** Pre-calculated step sizes (`Math.max(4, Math.floor(width / 150))`) to scale rendering calculations down dynamically on smaller viewports.
- **Teardown Safeguards:** Detached `resize`, `visibilitychange`, and `click` listeners inside `astro:before-swap` event handler.
- **Accessibility:** Honored `(prefers-reduced-motion: reduce)` by halting the animation frame loop by default and providing a accessible manual toggle button with status indicators.
