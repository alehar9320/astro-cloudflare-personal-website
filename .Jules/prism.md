# Prism Journal 👩‍🚀

## 2025-05-18 - Northern Lights Interactive Light Refraction Canvas Lab

- **Garbage Collection Metrics & Canvas Memory Thresholds**:
  - Dynamically calculated spatial step sampling (`Math.max(4, Math.floor(w / 120))`) reduced vertex evaluation loops from O(W) to O(W / step), preventing main thread locking and garbage collection thrashing.
  - Event listener cleanup on `astro:before-swap` and initialization guards (`canvas.dataset.initialized`) ensured zero memory leaks across client-side page transitions.

- **Reusable Math & Physics Logic**:
  - Multi-harmonic wave offset math combining primary and secondary sine waves (`calculateWaveY`).
  - Marine Blue (`rgba(10, 37, 64)`) to Cyan (`rgba(0, 242, 254)`) gradient color refraction interpolation (`refractColor`).
  - Quadratic falloff pointer distortion radius (`calculatePointerInfluence`) for tactile interactive light refraction.

- **Viewport & Device Scaling Strategies**:
  - Automatically scales canvas coordinate space with `devicePixelRatio` (capped at 2.0).
  - Listens to `prefers-reduced-motion` media queries and `visibilitychange` events to pause render loops automatically when tab is hidden or user prefers reduced motion.
