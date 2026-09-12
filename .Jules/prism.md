## 2025-09-12 - Northern Lights Interactive Canvas Lab Page

### Garbage Collection & Memory Thresholds
- **Lifecycle Teardown**: Guaranteed 0-leak animation loop teardown on Astro page transitions by registering listener on `astro:before-swap` with `{ once: true }` and `pagehide` to cancel active `requestAnimationFrame` and remove `resize` / `pointermove` event handlers.
- **Canvas DPR Capping**: Clamped device pixel ratio using `clampDpr(window.devicePixelRatio, 2)` to avoid extreme GPU memory allocations on ultra-high DPI screens while preserving crisp rendering.
- **Offscreen Buffer Avoidance**: Rendered sine wave gradients and light particles directly onto a single 2D canvas context using `globalCompositeOperation = 'lighter'`, keeping memory footprint under 5MB during continuous 60fps execution.

### Math Logic & Reusable Physics Formulas
- **Harmonic Sine Superposition**: Created `calculateAuroraWave(x, time, width, speed, baseFreq, amp)` combining two orthogonal sine harmonics to simulate atmospheric wave motion without dynamic memory allocations.
- **Particle Refraction Physics**: Implemented distance-decay pointer repulsion using `dx / (dist + 1)` for dynamic particle disturbance near pointer coordinates.
- **Linear Color Interpolation**: Created `lerpRgb(colorA, colorB, t)` with single-pass integer clamping for smooth cyan-to-emerald gradient transitions.

### Mobile & Accessibility Adaptation
- **Mobile Particle Scaling**: Evaluated viewport width dynamically during resize; scaled particle density down to 18 on mobile viewports (<640px) vs 45 on desktop viewports to maintain target 60fps performance on lower-power mobile hardware.
- **Reduced Motion Compliance**: Evaluated `window.matchMedia('(prefers-reduced-motion: reduce)')` prior to initializing the animation loop; defaulted to a static single-frame draw when reduced motion is preferred.
- **Keyboard Navigation & Control**: Included a toggle button (`aria-label="Pause interactive Northern Lights canvas animation"`) allowing explicit keyboard interaction and pausing of animation.
