## 2026-03-31 - Aurora Waves Interactive Canvas Lab

- **Garbage Collection & Memory Thresholds**: Animation frame loop `animationFrameId` is safely cancelled and all window/canvas event listeners (`resize`, `mousemove`, `mouseleave`) are cleaned up on `astro:before-swap` to prevent memory leaks during View Transitions.
- **Math Logic & Superposition**: Sine wave superposition combined with cosine harmonic shift (`Math.sin(x * wavelength + time * speed) + Math.cos(...)`) for natural plasma fluid motion. Cursor magnetosphere attraction calculates euclidean distance `dist = sqrt(dx^2 + dy^2)` to dynamically displace vertices smoothly.
- **Viewport & DPR Scaling**: Canvas width scales dynamically to container parent element while restricting DPR scaling to `Math.min(window.devicePixelRatio, 2)` for optimal render performance on High-DPI screen displays. Supports `prefers-reduced-motion` safety fallback.
