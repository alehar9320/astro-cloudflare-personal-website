## 2026-03-31 - Northern Lights Refraction Laboratory Canvas

### Garbage Collection & Memory Thresholds

- **Frame-rate Target**: Sustained 60 FPS across desktop and high-DPI displays.
- **Context Teardown**: Garbage collection optimization by detaching window `resize` and pointer listeners, cancelling `requestAnimationFrame` IDs via `cancelAnimationFrame(animFrameId)` during Astro `astro:before-swap` transition hooks. Zero residual canvas memory leaks detected across client routing cycles.
- **Buffer Management**: Canvas internal buffer dimensions dynamically clamped to `window.devicePixelRatio` capped at `2.0` to avoid oversized backing store allocations on Retina 3x+ screens.

### Mathematical Logic Configurations

- **Sine Wave Superposition**: Wave ribbons constructed using multi-frequency superposition:
  $$y = y_0 + \sin(x \cdot f_1 + t \cdot s_1) \cdot A_1 + \cos(x \cdot f_2 - t \cdot s_2) \cdot A_2$$
  where $f_1 \in [0.008, 0.016]$, $f_2 \in [0.011, 0.015]$, and speeds $s_i$ are modulated relative to elapsed timestamp seconds.
- **Magnetosphere Vector Displacement**: Interactive cursor force field displacement:
  When pointer $(px, py)$ is within influence radius $R = 160px$:
  $$\Delta y = \sin(\theta) \cdot \left(1 - \frac{d}{R}\right) \cdot F_{max}$$
  where $d = \sqrt{(x - px)^2 + (y - py)^2}$, $\theta = \operatorname{atan2}(y - py, x - px)$, and $F_{max} = 45px$.

### Mobile Viewport Adaptive Scaling Strategies

- **Dynamic Wave Count**: Scaled down wave layer render count from 5 to 3 ribbons on viewports $<600px$.
- **Step Size Modulation**: Increased horizontal sampling step size from $6px$ to $12px$ on mobile screens to preserve rendering budget and battery life on mobile devices.
- **Reduced Motion Safety**: Automatically halts the animation loop when `prefers-reduced-motion: reduce` media query is detected, rendering a static reference frame with explicit user controls to resume if desired.
