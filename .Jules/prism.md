# 👩‍🚀 Prism's Creative & Interactive Journal

## 2026-03-29 - [Aurora Wave Light Refraction Canvas] | Signal: Interactive Northern Lights Motion Craft
- **Garbage Collection Metrics & Memory Thresholds:**
  - Zero dynamic heap object allocation per animation frame inside the `render()` rendering loop.
  - Reused stack-allocated vector and point structures (`Point2D`, `RefractionVector`) to avoid GC thrashing.
  - Strict listener and animation frame teardown bound to `astro:before-swap` with `{ once: true }` prevents memory leaks during Astro SPA page navigation.
- **Reusable Math Logic Setup:**
  - Multi-harmonic sine wave superposition formula: `displacement = sin(x * freq + baseTime) * amp + sin(x * freq * 2.1 + baseTime * 1.3) * (amp * 0.35)`.
  - Distance-attenuated Gaussian refraction vector offset: `factor = Math.exp(-distSq / (2 * (maxRadius * 0.4)^2))`.
  - Palette color interpolation: Linear interpolation between Northern Lights Marine Blue (`rgba(10, 32, 64)`), Deep Cyan (`rgba(0, 180, 200)`), and Emerald Teal (`rgba(40, 230, 180)`).
- **Mobile Viewport Adaptive Scaling Strategy:**
  - `getAdaptiveCanvasQuality()` dynamically adjusts canvas `devicePixelRatio` target (capped at 1.25x on mobile / low-power hardware vs 2.0x on desktop retina).
  - Wave layer count reduces from 4 to 2 on viewports `< 640px` or when average FPS drops below 45 FPS.
  - Horizontal evaluation step size scales from 4px up to 8px or 10px on low-power devices to maintain a consistent 60fps budget.
