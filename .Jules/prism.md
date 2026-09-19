## 2026-03-31 - Northern Lights Interactive Refraction Canvas Lab

### Garbage Collection & Memory Performance
- **Canvas DPR Capping**: Capped `window.devicePixelRatio` at `Math.min(rawDpr, 2)` to constrain high-DPI canvas buffer memory allocation on retina viewports.
- **Zero-Allocation Animation Loop**: Reused static objects and scalar values inside `renderFrame` to eliminate garbage collection pressure during continuous 60 FPS animation.
- **Lifecycle Cleanup**: Strict teardown of `requestAnimationFrame` loops and canvas event listeners on `astro:before-swap` and `pagehide` prevents memory leaks during Astro client-side page transitions.

### Math Logic Setups
- **Multi-Harmonic Aurora Wave Synthesis**: Combined primary sine wave with sub-harmonic frequencies and micro-ripples for organic fluid motion:
  `y = sin(x * π * freq + t + phase) * amp + cos(x * π * freq * 1.5 - t * 0.8 + phase * 0.5) * (amp * 0.35) + sin(x * π * freq * 3.2 + t * 1.4) * (amp * 0.12)`
- **Smoothstep Light Refraction Vector Bending**: Implemented cursor-based optical refraction with quadratic attenuation falloff `(1 - d/r)^2 * strength` to simulate light bending without heavy physics libraries.

### Mobile Viewport Scaling Strategies
- **Dynamic Sampling Resolution**: `getOptimalParticleCount` scales horizontal sampling points dynamically (36 points for `<600px` / touch hardware, 64 for tablets, 100 for desktop) to maintain steady 60 FPS performance on lower-power mobile GPUs.
- **Accessibility Safeguard**: Automatically defaults to a static rendered frame when `prefers-reduced-motion` media query is active.
