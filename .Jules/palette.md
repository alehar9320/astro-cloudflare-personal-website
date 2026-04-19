# Palette 🎨 - UX & Accessibility Journal

## 2026-04-19 - Standardized Glassmorphic Focus States & Skip Link

**Learning:** Accessible navigation in a glassmorphic UI requires a balance between aesthetic subtlety and clear interactive affordances. A standard focus ring can be obscured by background blurs or gradients. By using `outline-offset: 4px` and a high-contrast accent color (`var(--accent-regular)`), we create a "halo" effect that works across different background intensities. Furthermore, implementing a "Skip to Content" link that shares the site's glassmorphic aesthetic ensures that accessibility features feel like an integral part of the design rather than an afterthought.

**Action:** Standardized `:focus-visible` across `Nav`, `Footer`, and `ThemeToggle` components using `2px solid var(--accent-regular)` with `4px` offset. Implemented a glassmorphic "Skip to Content" link in `BaseLayout` to improve keyboard navigation efficiency.

## 2025-05-15 - Improving Keyboard Accessibility with Enhanced Focus States

**Learning:** When implementing a glassmorphic design with subtle backgrounds and lift effects (like `translateY`), standard focus outlines can feel disconnected or get lost in the translucency. Using `:focus-visible` specifically allows for high-visibility outlines that only appear for keyboard users, avoiding visual noise for mouse users. Combining the focus state with the same "lift" effect used on hover provides a consistent spatial mental model for the interface.

**Action:** Consistently use `:focus-visible` with `outline: 2px solid var(--accent-regular)` and `outline-offset: 4px` on interactive cards and buttons. For components that lift on hover (e.g., `PortfolioPreview` cards), apply the same transformation to the focus state to ensure keyboard users experience the same interactive polish as mouse users.
