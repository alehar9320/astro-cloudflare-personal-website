# Prism Journal 👩‍🚀

## 2026-03-30 - Interactive Aurora Canvas Lab

### Garbage Collection & Memory Thresholds
- **DPR Capping:** Capped canvas render target scaling at `Math.min(window.devicePixelRatio, 2)` to eliminate excessive GPU allocations on high-DPI retina displays.
- **Canvas Lifecycle Teardown:** Bound event listener cleanup and `cancelAnimationFrame` to `astro:before-swap` with `{ once: true }` to guarantee no orphan animation loops or memory leaks persist across client-side page transitions.

### Math Logic Setup
- **Sine Wave Layering:** Leveraged multi-frequency sine wave calculations (`Math.sin(x * frequency + time * speed + phase) * amplitude + baseLine`) extracted into isolated pure utility `src/utils/aurora-math.ts`.
- **Cursor Light Refraction:** Computed pointer proximity distance (`Math.sqrt(dx^2 + dy^2)`) to displace wave heights within a 120px radius for responsive, fluid micro-interactions.

### Mobile Viewport Scaling & Accessibility
- **Adaptive Sizing:** Canvas dynamically scales via `getBoundingClientRect()` and `clientWidth/clientHeight` with touch/pointer events unified (`pointermove`, `pointerleave`).
- **Prefers-Reduced-Motion:** Gated initial animation state with `window.matchMedia('(prefers-reduced-motion: reduce)')` to automatically pause animation loops for users with motion sensitivities while offering a clear Play/Pause toggle button (meeting 44px touch targets).
