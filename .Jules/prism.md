# Prism Journal 👩‍🚀

## 2026-03-31 - Northern Lights Refraction Canvas Lab

### Math Logic & Refraction Physics
- **Multi-Harmonic Waves:** Combined primary sine wave `Math.sin(x * 0.015 + time * 1.2) * Math.cos(y * 0.012 - time * 0.8)` with secondary harmonic `Math.sin((x + y) * 0.008 + time * 0.6) * 0.5` in `src/utils/prism-math.ts`.
- **Pointer Falloff Distortion:** Implemented spatial falloff with 250px interaction radius. Distortions trigger `Math.sin(dist * 0.05 - time * 2) * (1 - dist / 250) * 0.8`.
- **Theme Color Interpolation:** Smooth 3-stop interpolation across Deep Marine Blue (`#002b49`), Cyan (`#00d2ff`), and Aurora Green (`#00ffb3`).

### Mobile Scaling & Performance Thresholds
- **Adaptive Step Size:** Dynamically selects grid step size based on viewport width (`step = 12` on viewports < 600px, `step = 8` on desktop) to maintain a steady 60fps across mobile and high-DPI viewports.
- **Device Pixel Ratio Cap:** Capped canvas DPR resolution multiplier to `Math.min(window.devicePixelRatio || 1, 2)` to eliminate excess GPU memory allocation on 3x retina devices.

### Memory & Lifecycle Cleanup Guardrails
- **Teardown listeners:** Attached cleanup handler on `astro:before-swap` to cancel `requestAnimationFrame`, detach `pointermove`, `pointerleave`, `resize`, and `visibilitychange` listeners.
- **Background Pause:** Pauses `requestAnimationFrame` loop on `visibilitychange` when `document.hidden === true` to avoid background main-thread processing.
- **Accessibility:** Honors `prefers-reduced-motion: reduce` by setting initial animation state to paused with accessible play toggle controls.
