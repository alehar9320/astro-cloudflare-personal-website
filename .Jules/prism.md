## 2026-03-31 - Aurora Refraction Field Canvas | **Metrics:** 60fps / Zero GC Allocations in Loop | **Math Setup:** Trigonometric Wave Synthesis & Cubic Smoothstep Falloff `(1 - d/r)^2` | **Mobile Scaling:** Downscaled Canvas Density (`0.5x`) on Viewports `< 640px` or DPR `> 2.5`

- **Garbage Collection Metrics & Memory Thresholds:**
  - Avoided inner-loop object/array allocations during 60fps canvas rendering by reusing linear/radial gradient instances and scalar trigonometric calculations (`calculateWaveHeight`).
  - Strict lifecycle teardown registered on `astro:before-swap` (`cancelAnimationFrame` and `removeEventListener`) prevents detached canvas context memory leaks during Astro client-side page transitions.

- **Math Logic Setup:**
  - Harmonic Wave Synthesis: Combined primary sine wave and secondary cosine harmonic (`cos(x * freq * 1.5 - t * 0.8 + phase * 0.5) * 0.35`) for fluid organic wave movement.
  - Light Refraction Field: Applied cubic smoothstep falloff `(1 - distance / radius)^2` for pointer-driven displacement vectors (`calculatePointerDisplacement`) inside `src/utils/aurora-math.ts`.

- **Mobile Viewport Scaling Strategy:**
  - Scaled canvas pixel density down to `0.5x` when container width is `< 640px` or DPR is `> 2.5` using `getMobileQualityScale`.
  - Gated motion loops behind `prefers-reduced-motion` media queries and accessible toggle button controls.
