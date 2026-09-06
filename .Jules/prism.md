# Prism 👩‍🚀 — Creative & Interactive Journal

## 2026-03-31 - Northern Lights Light Refraction Canvas

### Garbage Collection & Canvas Memory Thresholds
- **DPR Capping:** Capped canvas render resolution at `Math.min(window.devicePixelRatio, 2)` via `clampDpr()`. On 3x retina screens, this prevents excessive framebuffer allocations (capping memory usage at ~3.8MB for standard 450px high viewports).
- **Lifecycle Cleanup:** Listened to Astro's `astro:before-swap` event with `{ once: true }` to explicitly call `cancelAnimationFrame()`, `removeEventListener('resize')`, and unbind pointer event listeners, preventing memory leaks during page navigation.

### Math & Physics Logic
- **Superpositioned Sine Waves:** Wave elevation calculated using primary sine wave combined with secondary harmonic component (`calculateWaveY`).
- **Smoothstep Pointer Refraction:** Mouse/touch distortion calculated with cubic smoothstep easing (`factor * factor * (3 - 2 * factor)` in `calculatePointerDistortion`) for natural fluid deformation under pointer interaction.
- **Theme-Aware Color Palette:** `interpolateAuroraColor()` dynamically maps wave indices to Northern Lights marine blue (`hsla(210, 85%, ...)` to cyan (`hsla(170, 85%, ...)`).

### Mobile Viewport Adaptive Scaling
- On viewports < 640px:
  - Reduced total rendered wave layers from 5 to 3.
  - Increased horizontal step interval from 3px to 6px to cut vertex evaluations by 50%.
  - Adjusted interaction radius to 100px for optimal thumb touch targets.
