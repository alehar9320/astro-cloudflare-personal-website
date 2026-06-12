## 2025-05-22 - Interactive Aurora Background | Signal: Immersive Canvas Experience | Lean Implementation: 60 lines of logic

### Insights

- **Performance:** Using a single canvas with 3 overlapping sine-wave layers maintains a steady 60fps. The resolution (step) is set to 15px to balance smoothness and CPU usage.
- **Accessibility:** Implemented `prefers-reduced-motion` check to halt the animation loop and render a static frame for users who prefer minimal movement.
- **Canvas State Management:** Prevented `ctx.scale` from compounding on window resize events by using `ctx.setTransform(1, 0, 0, 1, 0, 0)` before applying the Device Pixel Ratio (DPR) scale.
- **Visual Continuity:** Ensured static visuals remain correctly scaled and visible after resize by triggering a manual `draw()` call when the animation loop is inactive (due to reduced motion or mobile throttling).
- **Visuals:** Combined with a CSS `blur(50px)` filter and a linear-gradient mask to create an ethereal, integrated "Northern Lights" effect that blends seamlessly with the glassmorphic theme.

### Math Logic Setup

- **Aurora Waves:** Combined three sine waves with varying frequencies (`0.0015`, `0.003`, `0.008`) and a low-frequency vertical drift.
- **Formula:** `y = base + sin(x*f1 + t*s1) * a1 + sin(x*f2 - t*s2) * a2 + sin(x*f3 + t*s3) * a3 + drift(t)`

### Mobile Adaptation

- On viewports < 50em, the canvas opacity is reduced to `0.4` and the blur is tightened to `30px` to maintain visual clarity without overwhelming smaller screens.
- Hardware acceleration forced via `transform: translateZ(0)`.

### Memory Thresholds

- Canvas size is synchronized with DPR-aware resolution.
- Animation frames are strictly canceled on `astro:before-swap` to prevent memory leaks during SPA-like navigation.
