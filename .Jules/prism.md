# 👩‍🚀 Prism's Journal

## 2026-03-31 - Interactive Northern Lights Refraction Laboratory

### Math Logic & Physics Setup
- Created pure TypeScript math utility module in `src/utils/auroraMath.ts` (100% test coverage in `src/utils/auroraMath.test.ts`).
- **Multi-Octave Wave Superposition:** Superimposes harmonic sine and cosine frequencies to generate fluid, organic Northern Lights ribbon waves (`getAuroraWaveY`).
- **Pointer Vector Attraction & Damping:** Updates particle velocities with inverse-distance vector attraction forces within a 200px interaction radius and smooth velocity damping (0.95–0.96 decay factor).
- **Light Refraction Angle Calculation:** Implements Snell's Law refraction index transformations (`calculateRefractionAngle`) with total internal reflection fallback guarding.

### Canvas Performance & Memory Thresholds
- **Device Pixel Ratio Capping:** Enforces `getCappedDpr` capping `window.devicePixelRatio` at `2` max to prevent excessive GPU memory allocations on 3x retina viewports while maintaining high visual crispness.
- **Lifecycle Garbage Collection:** Binds `astro:before-swap` listener to cancel `requestAnimationFrame` loops and unbind all `resize`, `mousemove`, `touchmove`, `mouseleave`, and `touchend` listeners.
- **60fps Frame Budget:** Keeps per-frame operations lightweight by avoiding dynamic object allocations inside the loop and reusing flat particle state structs.

### Viewport & Accessibility Adaptation
- **Mobile Viewport Scaling:** Automatically scales particle count down from 60 to 30 on screens under 600px width.
- **Accessibility (`prefers-reduced-motion`):** Automatically detects `prefers-reduced-motion: reduce` on initialization and starts the interactive canvas in a static, paused state with interactive Play/Pause controls.
- **WCAG Touch Targets:** Provided interactive Pause/Play and Reset buttons with `min-height: 44px` touch targets and distinct `:focus-visible` outline rings.
