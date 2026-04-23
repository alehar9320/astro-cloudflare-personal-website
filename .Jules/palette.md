# Palette 🎨 - UX & Accessibility Journal

## 2025-05-15 - Improving Keyboard Accessibility with Enhanced Focus States

**Learning:** When implementing a glassmorphic design with subtle backgrounds and lift effects (like `translateY`), standard focus outlines can feel disconnected or get lost in the translucency. Using `:focus-visible` specifically allows for high-visibility outlines that only appear for keyboard users, avoiding visual noise for mouse users. Combining the focus state with the same "lift" effect used on hover provides a consistent spatial mental model for the interface.

**Action:** Consistently use `:focus-visible` with `outline: 2px solid var(--accent-regular)` and `outline-offset: 4px` on interactive cards and buttons. For components that lift on hover (e.g., `PortfolioPreview` cards), apply the same transformation to the focus state to ensure keyboard users experience the same interactive polish as mouse users.

## 2025-05-16 - Standardizing Navigation Focus & Skip Links

**Learning:** Standardizing `:focus-visible` with `outline-offset` ensures clear visibility against glassmorphic backgrounds without distorting the layout. A "Skip to Content" link is essential for keyboard navigation in Astro projects with persistent navigation headers, and can be styled with glassmorphism to remain cohesive with the design system.

**Action:** Always implement a glassmorphic `skip-link` in `BaseLayout.astro` and ensure all interactive elements in `Nav` and `Footer` have explicit `:focus-visible` styles that use `outline-offset` to avoid clipping against translucency.
