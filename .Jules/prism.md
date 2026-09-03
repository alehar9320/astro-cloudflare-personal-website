# 👩‍🚀 Prism's Creative & Interactive Journal

## 2025-05-18 - Northern Lights Aurora Wave Simulation (`src/pages/lab/aurora.astro`)

### 🌀 Math Logic & Setup
- **Harmonic Sine Interference**: Combined 3 multi-frequency sine/cosine waves in `src/utils/aurora-math.ts`:
  `wave1 = sin(normX * 1.5 + time * 0.8 + offset)`
  `wave2 = sin(normX * 3.0 - time * 0.5 + offset * 1.3) * 0.5`
  `wave3 = cos(normX * 0.8 + time * 1.2 + offset * 0.7) * 0.25`
  This produces organic fluid wave contours resembling atmospheric Northern Lights ribbons.
- **Particle Vector Fields**: Calculated mouse distance vector `(dx, dy)` and applied inverse-proportional velocity repulsion forces `force = (1 - dist / maxDist) * 0.35` when interactive pointer movements enter within 120px radius.
- **Color Palette Interpolation**: Mapped color space from Emerald (HSLA 140°) through Cyan (HSLA 185°) to Marine/Violet (HSLA 240°), blending layers with soft alpha transparency.

### ⚡ Performance & Mobile Adaptive Scaling
- **Device Pixel Ratio Capping**: Capped `devicePixelRatio` at `Math.min(window.devicePixelRatio || 1, 2)` to avoid rendering 3x/4x high-density pixel buffers on mobile OLED screens.
- **Mobile Particle Density**: Scaled particle count adaptively (`width < 600 ? 30 : 60`) to preserve 60fps on low-power mobile GPUs.
- **Accessibility (`prefers-reduced-motion`)**: Checked `window.matchMedia('(prefers-reduced-motion: reduce)')`. When active, automatically freezes animation loop and renders a static, ambient Northern Lights gradient composition.

### 🧹 Garbage Collection & Canvas Lifecycle
- **Memory Threshold & Teardown**: Registered a single-execution listener on `astro:before-swap` with `{ once: true }`.
- Automatically calls `cancelAnimationFrame(animationFrameId)` and unbinds `resize`, `keydown`, `pointermove`, `pointerleave`, and button click event handlers to guarantee zero memory leaks or background thread execution during page swaps.
