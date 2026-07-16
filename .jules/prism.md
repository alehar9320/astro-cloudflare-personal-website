# Prism Journal - Creative & Interactive Upgrades

## 2025-03-02 - Generative Aurora Borealis Canvas Simulator

### Lean Implementation

- **File Isolated:** `src/pages/lab/aurora.astro`
- **Concept:** Immersive real-time mathematical simulation of the Northern Lights (Aurora Borealis) using HTML5 Canvas.
- **Lines of Code:** ~400 lines (HTML layout + scoped CSS + TypeScript state engine).

### Mathematical Logic Setup

1. **Harmonic Wave Superposition:**
   Each flowing aurora ribbon is modeled mathematically as a superposition of a low-frequency base sine wave and a higher-frequency cosine harmonic to produce natural organic peaks and troughs:
   ```typescript
   const baseOffset =
     Math.sin(x * wave.frequency + wave.phase + time * wave.speed) * wave.amplitude;
   const noiseComponent =
     Math.cos(x * (wave.frequency * 2.5) - time * wave.speed * 0.7) * (wave.amplitude * 0.35);
   let y = wave.baseYOffset + baseOffset + noiseComponent;
   ```
2. **Magnetic drag / Pointer attraction rule:**
   When mouse/touch coordinates are present, we measure the Euclidean distance between each horizontal wave control point and the pointer. Inside an active attraction radius, we apply an easing force field to deflect coordinates in vertical and horizontal dimensions:
   ```typescript
   const dx = x - mouseX;
   const dy = y - mouseY;
   const dist = Math.sqrt(dx * dx + dy * dy);
   if (dist < influenceRadius) {
     const pull = Math.pow(1 - dist / influenceRadius, 2.5) * 55;
     y += (dy / (dist || 1)) * pull;
   }
   ```

### Performance & Viewport Scaling Strategy

- **Mobile Adaptive Optimization:** Detected mobile/low-power screen widths using `window.matchMedia('(max-width: 48em)')`. Dynamically scaled horizontal step resolution `particleStep` from `6` (desktop) to `12` (mobile), which reduces canvas `fillRect` draw operations by 50% while maintaining crisp fluid motion.
- **Astro Lifecycle Cleanup:** To avoid thread leaks during client-side SPA routing transitions, registered an `'astro:before-swap'` listener to cancel active animation frame cycles (`cancelAnimationFrame`) and unbind window/pointer events.
- **Accessibility & Motion Controls:** Wrapped layout initialization inside a `prefers-reduced-motion` check to freeze animation flows by default for users with motion sensitivity. Provided a toggle action to resume simulation on-demand.
