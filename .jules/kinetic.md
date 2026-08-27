# Kinetic Journal ⚡

## 2026-08-27 - Hardware-Accelerated Image Zoom & Title Micro-Interactions in PortfolioPreview

- **Signal:** Portfolio preview cards lacked interactive dynamic depth and visual focus on project imagery during mouse hover/keyboard focus.
- **Action:**
  - Enhanced `src/components/PortfolioPreview.astro` with hardware-accelerated image scaling (`transform: scale(1.04)`) using smooth cubic-bezier timing (`cubic-bezier(0.22, 1, 0.36, 1)`).
  - Added subtle color and border accent transitions to `.title` on card hover and focus-visible.
  - Guarded image scale and title transitions with `@media (prefers-reduced-motion: reduce)` media queries to satisfy WCAG 2.1 AA accessibility standards.
- **Tokens Added:**
  - Image Scale: `scale(1.04)`
  - Bezier Curve: `cubic-bezier(0.22, 1, 0.36, 1)`
  - Title Hover Border: `hsla(var(--gray-999-basis), 0.3)`
