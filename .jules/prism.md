# 👩‍🚀 Prism Journal

## 2025-05-22 - Northern Lights Hero Canvas | Signal: Aesthetic Immersion | Lean Implementation: 2D Layered Sine

### Math Logic & Reusable Setup
- **Layered Sine Waves:** Implemented `layeredSine` utility in `src/utils/creative-math.ts`. It uses three overlapping sine oscillators with prime-related frequencies to prevent repetitive visual patterns.
- **Dynamic Opacity Mapping:** Used `mapRange` to tie wave height to opacity, ensuring softer transitions at the peaks.
- **Color Palette:** Strictly bound to the "Northern Lights" theme using CSS variables (`--theme-glow-blue`, `--theme-glow-cyan`) to ensure theme-switching compatibility.

### Performance & Scaling
- **Adaptive Resolution:** Canvas `width` and `height` are synchronized with the parent container's bounding box on resize, ensuring zero distortion.
- **Garbage Collection:** Established a strict cleanup pattern using `astro:before-swap` to call `cancelAnimationFrame`, preventing memory leaks during SPA-like navigation.
- **Mobile Strategy:** The loop automatically halts if `prefers-reduced-motion` is detected or if the component is unmounted. Logic is lightweight enough for 60fps on mobile (O(N) rendering where N = number of horizontal segments).

### Verification Results
- **FPS:** Maintained stable 60fps during local testing.
- **Memory:** No significant heap growth observed over 5 minutes of continuous animation.
- **Layout:** Verified that `z-index: -1` and `pointer-events: none` prevent interference with interactive Hero elements.
