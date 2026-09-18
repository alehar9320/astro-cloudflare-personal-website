## 2026-03-30 - Northern Lights Refraction Laboratory Canvas

### Math Logic Setup
- **Wave Superposition:** Multi-harmonic sine wave elevation $y(x, t) = A \cdot \sin(f \cdot x + s \cdot t + \phi)$ stacked across 4 wave layers with interpolated palette transitions (Marine Navy `#0a192f` $\rightarrow$ Electric Cyan `#00f2fe` $\rightarrow$ Aurora Green `#00f5a0`).
- **Gaussian Pointer Refraction:** Smooth exponential decay refraction vector field $f(d) = \exp(-(d/r)^2 \times 3) \cdot D_{\max}$ where $d$ is the pointer-to-vertex Euclidean distance, producing localized light warping without mesh instability.

### Canvas Memory & Performance
- **Device Pixel Ratio Capping:** Enforced `Math.min(window.devicePixelRatio, 2)` inside `calculateDPR()` to cap canvas backbuffer resolution at $2\times$ native screen pixels, preventing memory inflation on Retina $3\times/4\times$ mobile devices.
- **Garbage Collection Optimization:** Zero allocation within inner rendering loop `drawFrame()`. Vector math reuse and direct path commands eliminate intermediate heap allocations per frame.
- **Astro Lifecycle Cleanup:** Explicit teardown registered on `astro:before-swap` event cancelling `requestAnimationFrame` loop and removing window resize and canvas pointer event listeners.

### Viewport Scaling & Accessibility
- **Responsive Sizing:** CSS percentage layout with dynamic bounding box measurement in `resize()` handler.
- **Accessibility Safeguards:** Evaluates `prefers-reduced-motion: reduce` on initialization; automatically pauses animation loop when motion reduction is requested while maintaining static math frame rendering and full keyboard controls.
