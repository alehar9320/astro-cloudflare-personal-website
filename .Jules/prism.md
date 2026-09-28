# Prism's Journal 👩‍🚀

## 2026-03-31 - Northern Lights Canvas Laboratory & Smoothstep Refraction

### 1. Canvas Lifecycle & GC Memory Metrics
- **Teardown Standard**: Registered `astro:before-swap` listener cancels `requestAnimationFrame` IDs and removes pointer/resize/visibility listeners before Astro DOM swapping.
- **Initialization Guard**: Ensured `canvas.dataset.initialized === 'true'` state prevents duplicate animation loops during client-side hydration or repeated page visits.
- **Memory Footprint**: Capped resolution scaling at `Math.min(window.devicePixelRatio, 2)` to constrain canvas backing buffer memory overhead on Retina displays.

### 2. Math & Physics Reusable Setup
- **Compound Sine Waves**:
  $$\text{waveY}(x, t) = \left(\sin(x \cdot f + t \cdot s + \phi) + 0.35 \cos(x \cdot 1.5f - t \cdot 0.8s)\right) \cdot A$$
- **Cubic Smoothstep Falloff**:
  $$\text{attenuation}(d, r) = (1 - d/r)^2 \cdot (3 - 2(1 - d/r))$$
  Provides fluid optical light refraction without external physics engines or dynamic heap allocations.
- **Color Palette Interpolation**: Linear RGBA interpolation across Northern Lights palette points (deep marine `#020b18`, emerald `#10b981`, cyan `#00f2fe`, royal indigo `#1e1b4b`).

### 3. Mobile Viewport & Accessibility Strategies
- **Point Density Scaling**: Dynamic calculation `getScaledPoints(width, isMobile)` adjusts wave sample points from 16 points (<768px viewports) to 32+ points (>768px viewports) to guarantee 60fps rendering on mobile hardware.
- **Reduced Motion**: Checked `window.matchMedia('(prefers-reduced-motion: reduce)')`. Falls back to a serene static mesh frame and sets pause state.
- **Tab Visibility**: `document.addEventListener('visibilitychange')` pauses the animation loop when `document.hidden` is true, preserving battery life and CPU usage.
- **Keyboard Access**: Pause/Play toggle button styled with 44px min touch target and focus rings (`:focus-visible`).
