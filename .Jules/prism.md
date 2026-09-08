# 👩‍🚀 Prism Journal

## 2026-03-30 - Northern Lights Refraction Matrix Lab (`src/pages/lab/index.astro`)

### 🧠 Garbage Collection & Canvas Memory Thresholds
* **Lifecycle Teardown:** Implemented explicit event listener cleanup and `cancelAnimationFrame` teardown bound to the `astro:before-swap` event.
* **Allocation Minimization:** Reused fixed particle object structures and static color RGB tuples to eliminate per-frame garbage collection pressure. Capped particle pool array count dynamically based on viewport canvas area (`Math.min(floor(area / 12000), 60)`).
* **Frame Rate Execution:** Consistent 60fps rendering budget. Instantly halts frame request loop when canvas animation is paused or when `prefers-reduced-motion: reduce` is detected.

### 📐 Math Logic Setups
* **Harmonic Sine Waves (`calculateWaveOffset`):** Superimposes primary sine wave oscillations with a secondary harmonic frequency (`sin(x * freq * 2.3 + time * 1.5 + phase) * 0.35`) for natural fluid motion.
* **Particle Refraction Physics (`calculateParticleRefraction`):** Uses radial quadratic decay (`(1 - dist / maxRadius)^2`) to calculate directional particle displacement vectors (`dx`, `dy`) and refraction highlight intensity relative to an interactive focus coordinate.
* **RGB Color Interpolation (`interpolateColor`):** Smoothly transitions color tuples across the Northern Lights palette (`[10, 25, 47]` marine blue to `[64, 224, 208]` cyan to `[0, 255, 179]` aurora green).

### 📱 Mobile Viewport Adaptive Scaling
* **DPI Capping:** Capped canvas pixel density scale at `Math.min(window.devicePixelRatio || 1, 2)` to avoid excessive memory allocation on 3x retina displays.
* **Responsive Particle Density:** Dynamically calculates particle counts on window resize to ensure fluid performance across compact touch viewports and desktop displays.
