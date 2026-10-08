# Prism's Creative & Interactive Journal

## 2026-03-31 - Northern Lights Aurora Canvas Refraction Lab

### Garbage Collection & Memory Thresholds
- **Zero Allocations per Animation Frame**: Pre-allocated particle pool via `createParticlePool` ensures `updateParticlePositions` performs in-place mutation of velocity/position floats, maintaining 60fps with 0 runtime object allocations inside `requestAnimationFrame`.
- **Canvas Lifecycle Cleanup**: Added explicit teardown on `astro:before-swap` and paused execution on `visibilitychange` (`document.hidden`) to prevent memory leaks and unneeded background CPU consumption.

### Math Logic Setups
- **Multi-Wave Superposition**: `calculateAuroraWave` combines primary sine wave and secondary cosine wave with phase offsets (`Math.sin(x * w + time * speed + phase) * amplitude + Math.cos(x * w * 1.5 - time * speed * 0.8 + phase * 0.5) * (amplitude * 0.5)`).
- **Particle Spring & Cursor Refraction**: Damped velocity integration (`v *= 0.92`) with spring restoration force (`stiffness = 0.02`) and soft radial cursor repulsion (`radius = 120px`).

### Viewport Scaling Strategies
- **Dynamic Spatial Step Sampling**: Calculated vertex spatial step using `computeSpatialStep(w) = Math.max(4, Math.floor(w / 120))`. Scales sampling density smoothly from 16px on 1920px viewports to 4px on mobile (320px-480px), conserving render time on mobile GPUs while maintaining visual fidelity on desktop display.
