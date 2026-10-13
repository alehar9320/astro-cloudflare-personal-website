# Prism Journal

## 2026-10-13 - Northern Lights Aurora Wave Lab Canvas
- **Garbage Collection & Memory Thresholds:** Isolated HTML5 canvas lifecycle teardown on `astro:before-swap` listener. Detached event listeners (`mousemove`, `mouseleave`, `touchstart`, `touchmove`, `touchend`, `keydown`, `resize`) and invoked `cancelAnimationFrame` to avoid background memory leaks across Astro client-side page transitions.
- **Math Logic Setups:** Engineered multi-harmonic wave superposition (`computeWaveY`) and quadratic attenuation refraction displacement curves (`calculateRefractionOffset`) in pure, dependency-free TypeScript (`src/utils/aurora-wave.ts`).
- **Mobile Viewport Scaling & Performance:** Dynamic step sizing (`step = displayWidth < 600 ? 8 : 4`) and DPR capping (`Math.min(devicePixelRatio, 2)`) to ensure consistent 60fps across mobile hardware while respecting `prefers-reduced-motion: reduce`.
