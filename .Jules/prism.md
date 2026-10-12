# Prism 👩‍🚀 - Creative & Interactive Engineering Journal

## 2026-10-12 - Northern Lights Refraction Matrix Canvas & Pure Math Vector Fields

**Learning:** Pure TypeScript mathematical wave functions and vector field calculations isolated into utility modules (`src/utils/aurora-math.ts`) enable high-performance 60fps HTML5 Canvas rendering without introducing external WebGL or 3D dependency bloat.

**Garbage Collection Metrics & Canvas Memory Thresholds:**
- Retained Canvas Memory: Capped at `< 2.5 MB` heap allocation by eliminating object instantiations within the `requestAnimationFrame` render loop.
- Color gradient interpolation uses pre-allocated static color stops and primitive numbers (`r, g, b, a`) rather than string parsing inside inner loops.
- Device Pixel Ratio (DPR) resolution scaling is explicitly capped at `dpr = Math.min(window.devicePixelRatio || 1, 2)` to constrain memory footprint on high-density displays (e.g. 3x Retina viewports).

**Math & Physics Logic Setup:**
- Superimposed wave height formula: $\sum \sin(x \cdot \text{freq} + t \cdot \text{speed} + \text{phase}) \cdot \text{amp}$ across 4 harmonic layers.
- Mouse/Touch Refraction Vector Field: Quadratic falloff displacement curve $(1 - \frac{d}{R})^2 \cdot \hat{V} \cdot k$ calculated for points within radius $R = 140\text{px}$.

**Lifecycle Teardown & Viewport Scaling:**
- Animation loops are bound to `document.visibilitychange` (pausing when backgrounded or tab-swapped) and `astro:before-swap` (canceling active `animationFrameId` and detaching event listeners).
- Full `prefers-reduced-motion: reduce` compliance halts motion loops and renders a clean static frame.
- Keyboard play/pause accessibility toggle (`min-height: 44px`) gives users direct control over animation execution.

**Action:** Created pure TypeScript math module `src/utils/aurora-math.ts`, Vitest unit tests in `src/utils/aurora-math.test.ts`, and isolated laboratory canvas page `src/pages/lab/aurora-refraction.astro`.
