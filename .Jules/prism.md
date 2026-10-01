## 2025-10-01 - Northern Lights Canvas Light Refraction
- **Garbage Collection & Frame Rate**: Target 60fps achieved on HTML5 canvas by calculating aurora wave vertices at dynamic spatial step intervals (`Math.max(4, Math.floor(w / 120))`) rather than per-pixel loops, eliminating GC thrashing.
- **Math Logic Setup**: Reusable pure TypeScript math routines introduced in `src/utils/aurora-math.ts`:
  - Multi-harmonic sine wave synthesis `calculateAuroraWaveHeight` for natural curtain dynamics.
  - Cubic smoothstep falloff `cubicSmoothstep` for smooth vector displacement.
  - `calculateRefractionOffset` for pointer proximity displacement.
- **Viewport Scaling & Lifecycle Safeguards**:
  - Attached `visibilitychange` listener on `document` to cancel `requestAnimationFrame` when tab is hidden.
  - Teardown of all pointer, resize, and visibility listeners via `astro:before-swap` event.
  - `prefers-reduced-motion: reduce` fallback container automatically hides canvas and stops animation loop for user accessibility.
