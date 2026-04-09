# Palette's Journal 🎨

## 2025-05-21 - Enhanced Skip-to-Content & Focus States | **Learning:** Glassmorphism and Accessibility | **Action:** Use Backdrop-filter for UI elements

Implemented a "Northern Lights" themed "Skip to Content" link.
- **Insight:** Accessibility features like "Skip to Content" links don't have to be visually jarring. By applying glassmorphism (`backdrop-filter: blur(12px)`) and using theme-consistent transitions, we can make these features feel like an integrated part of the UI rather than an afterthought.
- **Insight:** Standardizing `<main id="main-content" tabindex="-1">` across all Astro pages ensures a reliable target for accessibility links, especially important in static/hybrid sites where navigation might be handled by the browser's default behavior.
- **Insight:** Mirrored `:hover` effects to `:focus-visible` for `PortfolioPreview` cards to provide equivalent visual feedback for keyboard users.
