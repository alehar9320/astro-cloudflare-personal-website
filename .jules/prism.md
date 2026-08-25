## 2026-03-31 - Aurora Refractor Interactive Canvas Lab

### Mathematical Logic Configurations

- **Wave Superposition:** Layered sine and cosine trigonometric calculations (`Math.sin(x * 0.005 + time + layer * 1.5) * (30 + layer * 10) + Math.cos(x * 0.002 - time * 0.5) * 15`) generating fluid aurora wave fields without heavy external noise libraries.
- **Magnetosphere Displacement:** Cursor distance vector calculation (`dist = Math.sqrt(dx * dx + dy * dy)`) calculating smooth force repulsion (`(150 - dist) / 150`) applied to light node coordinates and wave vertices.

### Memory & Performance Thresholds

- **Garbage Collection & Lifecycle:** Zero memory allocations inside render loop; particle arrays reused across resize invocations. Complete event listener and `requestAnimationFrame` teardown via `astro:before-swap`.
- **DPR Scaling:** Canvas resolution scaled dynamically up to `devicePixelRatio` max 2 to bound rendering cost while preserving crisp graphics on Retina displays.

### Viewport Adaptive Scale

- Mobile viewports (`< 50em`) scale canvas container height down to `280px` and automatically adjust particle bounds based on parent element width.
