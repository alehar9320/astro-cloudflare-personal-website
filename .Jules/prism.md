## 2025-05-18 - Northern Lights Refraction Field Lab Canvas

### **Math Logic & Physics Setup**
- **Trigonometric Wave Harmonics:** Multi-layered sine/cosine standing wave equations ($y = h \cdot (0.35 + 0.18w) + A_1 \sin(\omega_1 x + t) + A_2 \cos(\omega_2 x - t)$) rendering organic aurora curtains using marine cyan (`#00f2fe`) and deep violet gradients.
- **Particle Vector Attraction & Light Refraction:** Dynamic distance-decay vector force ($F = (1 - d/d_{\max}) \cdot k$) pulling cyan light particles toward active pointer coordinates, creating smooth fluid dampening without secondary physics dependencies.

### **Viewport & Mobile Scaling Strategies**
- **Adaptive Particle Budgeting:** Density thresholds auto-scale based on viewport width ($<768\text{px}$ allocates 25/45/70 particles vs. 40/80/130 on desktop) to preserve 60 FPS on low-power mobile GPUs.
- **High-DPI Canvas Backing Store:** Scaled canvas backing store using `Math.min(window.devicePixelRatio, 2)` to eliminate blurring on Retina displays while maintaining a strict performance budget.

### **Memory Management & Garbage Collection Guardrails**
- **Lifecycle Cleanup:** Bound `astro:before-swap` and `unload` listeners to cancel active `requestAnimationFrame` IDs, unbind window/pointer listeners, and destroy context references during Astro View Transitions.
- **Accessibility Fallback:** Evaluated `prefers-reduced-motion: reduce` query at initialization to immediately lock rendering to a static frame, skipping continuous loop execution.
