# Prism Journal

## 2026-03-31 - Northern Lights Mathematical Waves Canvas

- **Garbage Collection & Lifecycle:** Canvas context loop attached to `requestAnimationFrame` and `resize` passive listener. Full cleanup teardown bound to Astro's `astro:before-swap` transition event with `{ once: true }` listener, releasing frame handles and event hooks.
- **Performance & Reduced Motion:** Dynamic animation loop respects `prefers-reduced-motion: reduce`. When active or enabled, static rendered wave slices are drawn once without continuous animation loop ticks.
- **Math Logic & Superposition:** Multi-layered wave rendering using `Math.sin(x * frequency + time * speed)` combined with harmonic cosine terms `Math.cos(x * frequency * 0.5 + time * speed * 0.7)` for smooth, organic light refractions with marine blue, cyan, and emerald gradient stops.
- **Mobile Adaptive Scaling:** Canvas resolution dynamically bound to device pixel ratio capped at 2 (`Math.min(window.devicePixelRatio || 1, 2)`) with responsive canvas sizing based on parent container dimensions.
