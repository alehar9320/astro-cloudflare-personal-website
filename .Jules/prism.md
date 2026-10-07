## 2026-03-31 - Aurora Light Refraction Laboratory Canvas

- **Garbage Collection & Lifecycle Metrics**:
  - Bound `cancelAnimationFrame` and `removeEventListener` listeners to `astro:before-swap` and `visibilitychange` events to prevent background memory leaks across client transitions.
  - Reduced GC pressure by pre-allocating math wave parameters and scaling spatial step evaluation intervals (`getSpatialStep`) based on viewport width (`Math.max(4, Math.floor(w / 120))`).

- **Reusable Math Logic**:
  - Encapsulated sine wave superposition (`calculateAuroraWavePoint`) and Northern Lights color gradient interpolation (`getAuroraColor`) in pure TypeScript helper `src/utils/aurora-waves.ts`.

- **Viewport Scaling & Accessibility**:
  - Dynamically adjusted DPR scaling with `Math.min(window.devicePixelRatio || 1, 2)`.
  - Added `prefers-reduced-motion` auto-pause fallback and keyboard `[Space]` animation toggle for WCAG 2.1 AA accessibility compliance.
