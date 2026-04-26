# Palette 🎨 - UX & Accessibility Journal

## 2025-05-15 - Improving Keyboard Accessibility with Enhanced Focus States

**Learning:** When implementing a glassmorphic design with subtle backgrounds and lift effects (like `translateY`), standard focus outlines can feel disconnected or get lost in the translucency. Using `:focus-visible` specifically allows for high-visibility outlines that only appear for keyboard users, avoiding visual noise for mouse users. Combining the focus state with the same "lift" effect used on hover provides a consistent spatial mental model for the interface.

**Action:** Consistently use `:focus-visible` with `outline: 2px solid var(--accent-regular)` and `outline-offset: 4px` on interactive cards and buttons. For components that lift on hover (e.g., `PortfolioPreview` cards), apply the same transformation to the focus state to ensure keyboard users experience the same interactive polish as mouse users.

## 2025-05-16 - Glassmorphic Accessibility and Inset Focus Rings

**Learning:** Accessibility elements like "Skip to Content" links should share the design language of the site. A glassmorphic focus state (translucent background, backdrop-filter, and border) ensures these elements feel like a core part of the UI rather than an afterthought. For rounded interactive elements in tight layouts (like mobile menu buttons), an inset focus ring (`outline-offset: -0.5rem`) prevents the outline from being clipped or clashing with nearby elements while remaining highly visible.

**Action:** Implement glassmorphism for critical accessibility overlays and use negative `outline-offset` for pill-shaped buttons in header/footer contexts to maintain a clean, professional aesthetic without sacrificing keyboard discoverability.
