# Prism's Creative & Interactive Journal

## 2026-08-29 - Northern Lights Interactive Refraction & Magnetosphere Canvas

### Math Logic Setups
- **Sine Wave Superposition:** Multi-layered wave height calculations $y(x, t) = \sum_{i=1}^N A_i \sin(k_i x + \omega_i t + \phi_i)$ combining base amplitude, spatial frequency, propagation speed, and phase shifts in `src/utils/aurora-math.ts`.
- **Magnetosphere Vector Displacement:** Gaussian-squared radial deflection function $\mathbf{d}(\mathbf{p}, \mathbf{m}) = \frac{\mathbf{p} - \mathbf{m}}{\|\mathbf{p} - \mathbf{m}\|} \left(1 - \frac{\|\mathbf{p} - \mathbf{m}\|}{R}\right)^2 \cdot C$ warping vertex locations within radial threshold $R = 180\text{px}$.
- **Color Palette Interpolation:** Continuous color mapping across Northern Lights keyframes (Marine Blue `rgba(15, 23, 42)`, Deep Cyan `rgba(6, 182, 212)`, Electric Cyan `rgba(34, 211, 238)`, and Aurora Violet `rgba(129, 140, 248)`).

### Garbage Collection & Memory Performance
- **DPR Capping:** Capped `devicePixelRatio` at `2` in `src/pages/lab/aurora.astro` to prevent memory blowup on 4K/retina mobile viewports.
- **Teardown & GC:** Cleared animation frames via `cancelAnimationFrame` and detached `resize` and `pointermove` event listeners on Astro `astro:before-swap` transition event.
- **Render Budget:** Maintained stable 60fps at <1.2ms frame render times by stepping horizontal wave evaluation points (`stepX = Math.max(4, Math.floor(width / 120))`).

### Viewport & Mobile Scaling Strategies
- **Responsive Controls:** Flexible controls bar wrapping to stacked vertical orientation on narrow viewports (`< 40em`).
- **Touch-action:** Declared `touch-action: none` on the canvas wrapper to prevent touch scroll interference during magnetic field dragging.
- **Reduced Motion:** Checked `(prefers-reduced-motion: reduce)` media query; defaults to paused single-frame aurora snapshot for accessibility compliance.
