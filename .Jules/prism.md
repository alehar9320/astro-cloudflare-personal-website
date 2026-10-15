## 2025-05-18 - Northern Lights Wave Refraction Lab Experiment

- **Math & Physics Logic**: Implemented multi-sine wave superposition (`calculateAuroraWave`) and cosine-squared pointer refraction displacement curves (`calculatePointerRefraction`). Interpolated HSL color gradient ranges from deep marine blue (`hsla(215, 65%, 15%)`) to glowing cyan (`hsla(185, 100%, 55%)`).
- **Canvas Memory & GC Thresholds**: Isolated canvas allocation lifecycle with `getAuroraCanvasDimensions` capping DPR at 1 for mobile viewports and 2 for desktop screens to prevent excess VRAM consumption.
- **Teardown & Lifecycle**: Attached `astro:before-swap` listener to cancel `requestAnimationFrame`, detach pointer/resize listeners, and freeze loop state to guarantee 0 background thread leakage during page swaps.
