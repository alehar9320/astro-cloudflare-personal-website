# Palette 🎨 - UX & Accessibility Journal

## 2026-05-17 - Standardizing Focus States and Adding Tactile Active Feedback

**Learning:** Consistent spatial feedback for keyboard users (e.g., standardizing `outline-offset: 4px` across all interactive components) reinforces a predictable mental model of the interface. Furthermore, adding subtle `:active` scale transformations to primary navigation and footer links provides a tactile, "pressed" sensation that confirms user intent and enhances the perceived responsiveness of the application.

**Action:** Standardized focus outlines to use a consistent `4px` (or `0.25rem`) offset across global links and navigation elements. Implemented `transform: scale(0.97)` (or similar) feedback for the `:active` state of navigation and footer links to improve interactivity and delight.

## 2025-05-17 - Avoiding Deceptive Interactivity and Unifying Focus States

**Learning:** "Deceptive interactivity" (e.g., using `cursor: pointer` or "lift" effects on non-clickable elements like badges) creates a broken promise to the user, leading to frustration when clicking doesn't trigger an action. Additionally, links with custom classes often miss the global focus indicator styles, creating an inconsistent experience for keyboard users.

**Action:** Removed pointer cursors and interactive transformations from the `Pill` component to better reflect its status as a static badge. Unified focus states by explicitly adding `:focus-visible` outlines to navigational links with classes (`.back-link`, `.version-link`), ensuring a consistent 2px accent outline with 4px offset across the site.

## 2025-05-15 - Improving Keyboard Accessibility with Enhanced Focus States

**Learning:** When implementing a glassmorphic design with subtle backgrounds and lift effects (like `translateY`), standard focus outlines can feel disconnected or get lost in the translucency. Using `:focus-visible` specifically allows for high-visibility outlines that only appear for keyboard users, avoiding visual noise for mouse users. Combining the focus state with the same "lift" effect used on hover provides a consistent spatial mental model for the interface.

**Action:** Consistently use `:focus-visible` with `outline: 2px solid var(--accent-regular)` and `outline-offset: 4px` on interactive cards and buttons. For components that lift on hover (e.g., `PortfolioPreview` cards), apply the same transformation to the focus state to ensure keyboard users experience the same interactive polish as mouse users.

## 2025-05-16 - Glassmorphic Accessibility and Inset Focus Rings

**Learning:** Accessibility elements like "Skip to Content" links should share the design language of the site. A glassmorphic focus state (translucent background, backdrop-filter, and border) ensures these elements feel like a core part of the UI rather than an afterthought. For rounded interactive elements in tight layouts (like mobile menu buttons), an inset focus ring (`outline-offset: -0.5rem`) prevents the outline from being clipped or clashing with nearby elements while remaining highly visible.

**Action:** Implement glassmorphism for critical accessibility overlays and use negative `outline-offset` for pill-shaped buttons in header/footer contexts to maintain a clean, professional aesthetic without sacrificing keyboard discoverability.
