## 2025-05-18 - [Interactive Canvas & Northern Lights Refraction]

- **Garbage Collection Metrics & Canvas Memory Thresholds**:
  - Bound single high-DPR scaled canvas context (`dpr = Math.min(window.devicePixelRatio, 2)`).
  - Explicit teardown on `astro:before-swap` event via `cancelAnimationFrame(animationFrameId)` and event listener removal ensures 0 lingering requestAnimationFrame loops or GC memory leaks during Astro client-side page transitions.

- **Math Logic Setups**:
  - Multi-harmonic sine wave synthesis (`calculateAuroraWaveHeight`) using 3 distinct wave layer frequencies ($k$, $2k$, $3.5k$).
  - Optical point displacement using cubic smoothstep attenuation (`(1 - distance/radius)^2`) for fluid pointer-driven light refraction without external physics libraries.

- **Mobile Viewport Scaling Strategy**:
  - Dynamic scale factor calculator (`getMobileScaleFactor`) downscaling wave amplitude and wavelength proportionally on mobile viewports (<768px).
  - Step size adjustment (`calculateParticleStep`) increasing point sampling step from 4px (desktop) to 6px/8px (mobile) to guarantee consistent 60fps rendering across low-power hardware.
