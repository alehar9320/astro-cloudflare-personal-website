# Prism Journal 👩‍🚀

## 2025-05-18 - Interactive Aurora Refraction Canvas

### Strategy & Creative Concept
- Created an interactive Northern Lights (Aurora) light refraction experiment in `src/components/AuroraCanvas.astro` and isolated laboratory route `src/pages/lab/index.astro`.
- Modeled realistic organic northern lights curtains using harmonic sine wave superposition (`calculateAuroraWave`) and interactive vector field displacement (`calculatePointerRefraction`).

### Math Logic & Color Palette
- **Harmonic Wave Superposition:** Combined primary wave ($f_1 = 0.006$, $A_1 = 25..35$), secondary wave ($f_2 = 2.3f_1$, $A_2 = 0.4A_1$), and low-frequency phase harmonic ($A_3 = 0.25A_1$).
- **Refraction Vector Displacement:** Gaussian-like quadratic distance falloff curve $f(d) = (1 - d/R)^2$ for $d < R$, driving smooth directional light bending toward pointer interaction points without abrupt steps.
- **Color Interpolation:** Linear interpolation across "Northern Lights" palette: Deep Marine (`rgb(2,11,24)`) -> Deep Teal (`rgb(0,64,82)`) -> Vibrant Cyan (`rgb(0,242,254)`) -> Aurora Emerald (`rgb(0,255,163)`).

### Canvas Memory & Garbage Collection Metrics
- **DPR Capping:** Capped canvas render scale at `Math.min(window.devicePixelRatio, 2)` to eliminate excessive allocation overhead on high-density Retina viewports.
- **Allocation-Free Loop:** Pre-allocated vector calculation objects and step iteration counts per frame, eliminating object creation in the `requestAnimationFrame` render loop.
- **Lifecycle Teardown:** Explicitly detached all event listeners (`pointermove`, `pointerleave`, `resize`, `visibilitychange`, button listeners) and cancelled pending animation frames on `astro:before-swap` and when switching browser tabs (`document.hidden`).

### Mobile Scaling & Accessibility
- Scaled step interval dynamically based on client width (`stepX = Math.max(4, Math.floor(width / 120))`), keeping vertex iteration under 120 nodes per curtain.
- Integrated `prefers-reduced-motion` media query guard: automatically disables active animation loop and renders a static rendered frame with explicit Play Motion toggle affordance.
