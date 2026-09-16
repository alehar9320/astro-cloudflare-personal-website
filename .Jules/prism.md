# 👩‍🚀 Prism's Journal

## 2025-02-17 - Interactive Aurora Wave Refraction Matrix

### Garbage Collection & Canvas Memory Thresholds
- **DPR Capping**: Enforced `clampDpr(window.devicePixelRatio, 2)` to constrain backbuffer allocations on high-DPI (Retina) displays. Capping DPR at 2x caps peak canvas memory usage at ~4.8MB for a 1200x400 display viewport, preventing GPU frame drops and high memory allocation rates.
- **Zero-Allocation Rendering Loop**: Render step iterates along the X axis using fixed spatial intervals (`step = 6`) and reuses stack-allocated primitive variables (`x`, `y`, `refraction`). Zero array creation or heap allocations take place inside the `requestAnimationFrame` loop, resulting in a flat GC allocation profile at 60fps.
- **Teardown Mechanics**: Enforced `cancelAnimationFrame` and `removeEventListener` on `astro:before-swap` to purge active RAF timers and DOM listeners prior to Astro client-side view transitions.

### Math Logic Setups
- **Trigonometric Harmonic Wave Synthesis (`harmonicWave`)**:
  Combined primary and secondary harmonic sine frequencies:
  `f(x, t) = sin(x * freq + t + phase) * amp + sin(x * freq * 0.5 - t * 0.7) * (amp * 0.35)`
  Produces multi-layered organic fluid wave motion without external noise libraries.
- **Radial Refraction Attenuation (`calculateRefractionOffset`)**:
  Calculates Gaussian-like radial displacement vector relative to cursor/touch coordinates using smooth cosine falloff:
  `factor = 0.5 * (1 + cos(pi * dist / radius)) * strength`
  Displaces wave vertex coordinates outward away from pointer within interaction radius `R = 140px`.

### Mobile Viewport Scaling Strategies
- **Fluid Container Resizing**: Attached passive `resize` event handler that calculates viewport dimensions via `viewport.clientWidth` and `viewport.clientHeight`. Dynamic scale factors (`ctx.scale(dpr, dpr)`) normalize canvas drawing commands across both mobile and desktop viewports.
- **Touch Interaction Harmonization**: Attached passive `touchstart`, `touchmove`, and `touchend` event listeners mapping touch coordinates to canvas space and enabling smooth touch refraction on mobile devices without scrolling interference (`touch-action: none`).
- **Accessibility & Low-Power Fallback**: Gated animation loop progression with `window.matchMedia('(prefers-reduced-motion: reduce)')`. Renders static wave ribbons when reduced motion is preferred.
