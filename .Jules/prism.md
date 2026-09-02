## 2026-03-29 - [Northern Lights Canvas Lab]

### Garbage Collection & Memory Thresholds
- Hardware-accelerated canvas rendering loops scale particle counts dynamically (35 on desktop viewport, 15 on mobile < 600px) to sustain a strict 60fps frame budget.
- Memory leak prevention verified: explicit teardown listeners bound to `astro:before-swap` with `{ once: true }` cancel `requestAnimationFrame` loop and remove pointer/keyboard event listeners on client-side page transitions.

### Reusable Math Logic Setups
- Pure TypeScript wave superposition utility (`superimposeWaves` in `src/utils/aurora-math.ts`) calculates multi-frequency sine offsets without dynamic array allocations or external dependencies.
- Vector wrapping physics (`updateParticle`) handles particle positions across canvas boundaries via modulo math.

### Mobile Viewport Scaling Strategies
- Device pixel ratio capped at `dpr = Math.min(window.devicePixelRatio || 1, 2)` to eliminate excess pixel rendering on ultra-dense mobile screens.
- Canvas dimensions dynamically track parent bounding rect with responsive fallback sizes.
