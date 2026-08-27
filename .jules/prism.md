## 2025-05-18 - Northern Lights Wave Superposition & Light Refraction Field

- **Garbage Collection & Memory Thresholds:**
  - Standard Canvas 2D Context setup with device pixel ratio scaling capped at `min(window.devicePixelRatio, 2)`.
  - Zero allocation within the 60fps render loop: pre-allocated particle array, math constants, and linear gradients reused per frame.
  - Strict lifecycle teardown attached to Astro `astro:before-swap` and `beforeunload` events, invoking `cancelAnimationFrame` and unbinding all pointer/touch/window event listeners to prevent heap/closure leaks across View Transitions.

- **Mathematical Logic Configurations:**
  - **Harmonic Wave Superposition:** Combined triple sine and cosine harmonic equations:
    `y(x, t) = y_center + 28·sin(0.008·x + 1.2·t) + 18·sin(0.015·x - 0.8·t) + 35·cos(0.004·x + 0.5·t)`
  - **Cursor Magnetosphere Vector Displacement:** Inverse quadratic falloff for interactive pointer vector displacement:
    `displacement = Math.pow(1 - d / R, 2) · 25 · sin(3·t + 0.02·x)` where `d = hypot(x - mx, y - my)` for `d < R`.
  - **Particle Magnetosphere Pull:** Particle attraction vector `pull = (1 - d / R) · 15` directed along normal vector `(dx/d, dy/d)`.

- **Mobile Viewport Adaptive Scale Strategies:**
  - Dynamic resolution adaptation: sampling step increased from 5px (desktop) to 10px (mobile `< 768px`) to minimize `lineTo()` path execution overhead.
  - Dynamic particle count adaptation: reduced from 35 nodes (desktop) to 12 nodes (mobile).
  - Respects `prefers-reduced-motion`: defaults to paused static snapshot if system preference is set to reduced motion, with accessible keyboard toggle button.
