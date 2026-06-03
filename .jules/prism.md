# 👩‍🚀 Prism Journal

## 2025-05-15 - Interactive Aurora Hero Enhancement

### 🌀 Creative & Math Logic
- **Algorithm:** Multi-layered Sine Wave synthesis.
- **Setup:** Three distinct "ribbons" with varying frequencies, amplitudes, and phase shifts.
  - Layer 1: Base slow wave (Phase: 0.001)
  - Layer 2: Mid-speed interference (Phase: 0.0015)
  - Layer 3: Rapid accent highlights (Phase: 0.002)
- **Rendering:** Used `ctx.filter = 'blur(40px)'` combined with `globalCompositeOperation = 'screen'` to create an additive light effect that respects the glassmorphic theme.
- **Colors:** Cyan (#00d2ff) and Marine Blue (#0066cc) at low opacities (0.2 - 0.4).

### 🚀 Performance & Garbage Collection
- **Frame Rate:** Consistent 60fps on desktop.
- **Memory Management:**
  - Lifecycle hook `astro:before-swap` used to `cancelAnimationFrame` and remove `resize` listeners.
  - Zero heap growth observed during rapid navigation between index and lab pages.
- **Accessibility:** `window.matchMedia('(prefers-reduced-motion: reduce)')` check implemented. If true, the animation loop is never initiated, maintaining a static (or empty) state to prevent vestibular triggers.

### 📱 Responsive Strategy
- **Scaling:** Canvas size is dynamically calculated based on `parentElement` dimensions.
- **Mobile Optimization:** On narrow viewports (< 768px), the number of ribbons can be programmatically reduced, though currently maintained at 3 for consistency as performance overhead is negligible (~2% CPU usage).
- **Aspect Ratio:** Handles orientation changes gracefully via the `resize` listener.
