# Prism Journal 👩‍🚀

## 2025-05-15 - Interactive Northern Lights Aurora Background

### Performance & Metrics

- **Frame Rate:** Maintained a consistent 60fps on desktop.
- **Memory Management:** Implemented strict cleanup of `requestAnimationFrame` and event listeners using the `astro:before-swap` event.
- **Reduced Motion:** Integrated `window.matchMedia('(prefers-reduced-motion: reduce)')` check to proactively disable the animation loop and event listeners for accessibility compliance.
- **Mobile Optimization:** Automatically disables the animation loop and hides the component on viewports < 800px to preserve battery and performance on mobile devices.
- **Resolution Scaling:** Implemented a `resolutionScale` of 0.5, drawing the canvas at half the display size and scaling up via CSS to drastically reduce fill-rate costs.

### Math Logic Setup

- **Aurora Movement:** Used four overlapping sine waves with randomized but stable vertical positions.
- **Refraction Effect:** Implemented a mouse-follow "distortion" where the vertical phase of the sine waves is shifted based on proximity to the cursor.
- **Visuals:** Offloaded blurring to CSS `filter: blur(80px)` with hardware acceleration, replacing expensive in-canvas blur filters.

### Mobile Adaptation

- **Disabling:** Following the creative principle of "automatically scale down or disable their loops on mobile", the JS loop is completely bypassed on mobile viewports.
- **Consistency:** The background remains a clean, minimalist gradient/solid color on mobile, preserving the site's core structure.
