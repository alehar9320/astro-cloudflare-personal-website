# 👩‍🚀 Prism Journal

## 2026-03-30 - Interactive Northern Lights Refraction Laboratory
- **Canvas Memory & Performance Thresholds:**
  - Enforced DPR capping (`Math.min(window.devicePixelRatio, 2)`) to prevent excessive memory consumption and VRAM allocation on Retina/high-DPI displays.
  - Implemented single-pass wave step sampling (`step = 8`) to maintain 60fps frame rate without heavy CPU overhead.
  - Registered lifecycle cleanup handler on `astro:before-swap` to explicitly invoke `cancelAnimationFrame` and unbind pointer/window event listeners upon Astro view transitions.
- **Math Logic & Physics Setup:**
  - Implemented pure TypeScript math utilities (`smoothstep`, `calculateAuroraWave`, `calculateRefractionForce`) in `src/utils/aurora-math.ts` without external dependencies.
  - Superposed sine/cosine wave equations (`Math.sin`, `Math.cos`) with modulated frequency and speed to simulate organic Northern Lights curtain motion.
  - Used smoothstep Hermite interpolation to generate smooth radial light field refractions around active cursor points and ripple origins.
- **Mobile Adaptive Scaling:**
  - Dynamically recalculated canvas dimensions using parent bounding box size during resize events and high-DPI scaling.
  - Provided `prefers-reduced-motion: reduce` detection to automatically start in a paused state, respecting accessibility preferences while offering manual play/pause controls.
