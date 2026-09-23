# Prism 👩‍🚀 Journal

## 2026-03-31 - Northern Lights Aurora & Refraction Canvas Lab

- **GC Metrics & Canvas Memory Thresholds:**
  - Offscreen/background rendering zero-allocation loop using non-alpha context (`{ alpha: false }`) and DPR scaling capped at `min(window.devicePixelRatio, 2)`.
  - Frame rate target maintained at 60 FPS on desktop (with fallback to 30 FPS under low-power / low hardware concurrency mode). Memory footprint kept under ~2MB VRAM threshold for 480px viewport.
  - Complete animation frame and pointer event listener teardown on `astro:before-swap` to eliminate client-side navigation memory leaks.

- **Math Logic Setups:**
  - Compound wave offsets combining primary sine waves (`sin(x*freq + t*speed)`), harmonic half-frequency waves (`cos(x*freq*0.5 - t*speed*0.7)`), and micro harmonics (`sin(x*freq*1.8 + t*speed*1.2)`).
  - Cubic smoothstep light refraction falloff: `cubicSmoothstep(distance, radius)` calculating `t = 1 - d/r; return t * t * (3 - 2 * t)` for smooth optical light refraction around mouse/touch coordinates without physics overhead.

- **Mobile Viewport Scaling Strategies:**
  - Dynamic `getPerformanceConfig(isMobile, isLowPower)` scaling wave count from 5 down to 3 (mobile) or 2 (low power), and sample step resolution from 3px to 5px (mobile) or 8px (low power).
  - Canvas height scales from 480px to 360px on viewports under 768px with full `prefers-reduced-motion` compliance static fallback.
