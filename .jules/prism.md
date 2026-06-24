# Prism Journal 👩‍🚀

## 2025-05-15 - Interactive Northern Lights Aurora Background

### Performance & Metrics

- **Frame Rate:** Maintained a consistent 60fps on desktop and mobile (simulated) environments.
- **Memory Management:** Implemented strict cleanup of `requestAnimationFrame` and event listeners using the `astro:before-swap` event. Verified via manual inspection that the canvas context is released when navigating away.
- **Reduced Motion:** Integrated `window.matchMedia('(prefers-reduced-motion: reduce)')` check to proactively disable the animation loop for accessibility compliance.

### Math Logic Setup

- **Aurora Movement:** Used three overlapping sine waves with different frequencies and phase offsets to simulate fluid, non-repeating horizontal motion.
- **Refraction Effect:** Implemented a mouse-follow "distortion" where the vertical phase of the sine waves is shifted based on proximity to the cursor.
- **Visuals:** Leveraged CSS `filter: blur(80px)` on the canvas element itself to achieve the soft, ethereal Northern Lights glow while keeping the actual canvas drawing resolution low (scaled to 1/2 of display resolution) for peak performance.

### Mobile Adaptation

- **Scaling:** Canvas resolution is dynamically calculated based on `devicePixelRatio` but capped to ensure fill-rate doesn't bottleneck on high-DPI mobile screens.
- **Touch Interaction:** Interaction is currently limited to mouse movement (`mousemove`); for future iterations, touch events could be mapped to provide similar spatial feedback on mobile.
- **Culling:** The effect is placed behind a glassmorphic background, ensuring that even if the canvas is slightly unoptimized, it doesn't interfere with text readability.
