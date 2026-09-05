# Prism 👩‍🚀 - Creative & Interactive Log

## Aurora Wave Superposition Canvas (src/pages/lab/index.astro)

### Math & Wave Superposition Logic
- Custom pure TypeScript math functions (`src/utils/aurora-math.ts`) for calculating wave heights using multi-layered sine wave formulas: `Math.sin(x * frequency + time * speed + phase) * amplitude`.
- Smooth color interpolation across Northern Lights color palette (`marineBlue`, `cyan`, `emerald`).

### Garbage Collection & Memory Management
- Bound `astro:before-swap` event listener with `{ once: true }` to cancel active `requestAnimationFrame` loops and unbind window resize handlers upon Astro client-side navigation.
- Canvas DPI rendering capped at `Math.min(window.devicePixelRatio, 2)` to optimize GPU memory allocations.

### Accessibility & Motion Budgeting
- Checked `prefers-reduced-motion: reduce` on initialization; automatically disables active animation loops for users requesting reduced motion.
- Interactive accessible control button with WCAG compliant 44px min touch target for manual play/pause controls.
