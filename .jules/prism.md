## 2025-08-24 - Aurora Refraction & Magnetosphere Lab Canvas

### Garbage Collection & Canvas Memory Thresholds

- **Zero Allocations in Loop:** Node calculations reuse primitive numbers (`x`, `y`, `rawY`, `finalX`, `finalY`) inside 2D Canvas rendering loop, preventing garbage collection thrashing during continuous requestAnimationFrame execution.
- **Canvas Context Scaling:** DPR-capped at `Math.min(devicePixelRatio, 2)` to keep frame buffer allocations within ~2.5MB at 1080p canvas render targets.
- **Frame-Rate Target:** 60fps locked on desktop viewports; smooth requestAnimationFrame scheduling with automatic loop cancellation on `astro:before-swap` and page unload.

### Mathematical Logic Configurations

- **Sine Wave Superposition:** `y = sin(x·f + t + φ)·A + sin(x·f·2.1 + t·1.5)·(0.35·A)` where fundamental wave $A \in [28, 52]\text{px}$ is combined with secondary harmonic at $2.1\times$ spatial frequency and $1.5\times$ temporal speed.
- **Cursor Magnetosphere Vector Displacement:** `F_vec = (Δp / |Δp|) · (1 - |Δp|/R)² · S` using quadratic attenuation over force radius $R = 140\text{px}$ and force strength $S = 38\text{px}$ for fluid pointer interaction.

### Mobile Viewport Adaptive Scale Strategies

- **Viewport Scaling:** Downscales canvas sampling node density dynamically via `getAdaptiveScale(viewportWidth)` (0.4x for `<480px`, 0.65x for `<768px`, 1.0x for desktop).
- **Accessibility & Motion Preference:** Respects `prefers-reduced-motion: reduce` media query by rendering static single-frame canvas snapshot and defaulting animation loop state to paused.
