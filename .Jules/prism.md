# Prism Journal 👩‍🚀

## 2025-05-18 - Northern Lights Aurora Refraction Canvas Lab Experiment

- **Garbage Collection & Lifecycle Teardown Metrics**:
  - Attached `astro:before-swap` listener to cancel `requestAnimationFrame` loops and unbind window/canvas event listeners (`resize`, `mousemove`, `touchmove`, `click`).
  - Capped HTML5 Canvas Device Pixel Ratio (`Math.min(window.devicePixelRatio, 2)`) in `capDevicePixelRatio` to eliminate dynamic memory bloat and GPU fillrate bottlenecks on high-DPI retina viewports.
- **Math Logic Setup**:
  - Implemented pure TypeScript multi-harmonic sine wave synthesis `calculateAuroraWaveElevation` combined with damped spring physics `updateSpringState` for smooth cursor refraction forces.
  - Linear RGB interpolation `interpolateColor` across the Northern Lights spectrum (`marine`, `cyan`, `emerald`, `violet`, `sky`).
- **Mobile Viewport Scaling Strategy**:
  - Fluid parent-container sizing using `canvas.parentElement.clientWidth/clientHeight` with touch passive event listeners.
  - Fallback motion gating via `window.matchMedia('(prefers-reduced-motion: reduce)')` and keyboard accessible play/pause controls.
