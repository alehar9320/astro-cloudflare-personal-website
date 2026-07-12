# Palette 🎨 - UX & Accessibility Journal

## 2026-05-17 - Enhancing Content Selection and Standardizing Focus Spatiality

**Learning:** Using `user-select: none` on informational badges (like `Pill`) creates unnecessary friction for users trying to copy text for reference. Additionally, consistent `outline-offset: 4px` across all interactive elements (including theme toggles and cards) reinforces a predictable spatial model for keyboard users. Adding `target="_blank"` with `rel="noopener noreferrer"` to external informational links (like the Astro framework link in the footer) ensures a non-disruptive navigation experience that preserves the user's session.

**Action:** Standardized `outline-offset: 4px` for `ThemeToggle` and `.mention-card` focus states. Removed `user-select: none` and hover transitions from the `Pill` component to improve content accessibility and prevent deceptive interactivity. Enhanced the Astro framework link in the footer with secure, external-opening attributes.

## 2025-05-17 - Avoiding Deceptive Interactivity and Unifying Focus States

**Learning:** "Deceptive interactivity" (e.g., using `cursor: pointer` or "lift" effects on non-clickable elements like badges) creates a broken promise to the user, leading to frustration when clicking doesn't trigger an action. Additionally, links with custom classes often miss the global focus indicator styles, creating an inconsistent experience for keyboard users.

**Action:** Removed pointer cursors and interactive transformations from the `Pill` component to better reflect its status as a static badge. Unified focus states by explicitly adding `:focus-visible` outlines to navigational links with classes (`.back-link`, `.version-link`), ensuring a consistent 2px accent outline with 4px offset across the site.

## 2025-05-15 - Improving Keyboard Accessibility with Enhanced Focus States

**Learning:** When implementing a glassmorphic design with subtle backgrounds and lift effects (like `translateY`), standard focus outlines can feel disconnected or get lost in the translucency. Using `:focus-visible` specifically allows for high-visibility outlines that only appear for keyboard users, avoiding visual noise for mouse users. Combining the focus state with the same "lift" effect used on hover provides a consistent spatial mental model for the interface.

**Action:** Consistently use `:focus-visible` with `outline: 2px solid var(--accent-regular)` and `outline-offset: 4px` on interactive cards and buttons. For components that lift on hover (e.g., `PortfolioPreview` cards), apply the same transformation to the focus state to ensure keyboard users experience the same interactive polish as mouse users.

## 2025-05-16 - Glassmorphic Accessibility and Inset Focus Rings

**Learning:** Accessibility elements like "Skip to Content" links should share the design language of the site. A glassmorphic focus state (translucent background, backdrop-filter, and border) ensures these elements feel like a core part of the UI rather than an afterthought. For rounded interactive elements in tight layouts (like mobile menu buttons), an inset focus ring (`outline-offset: -0.5rem`) prevents the outline from being clipped or clashing with nearby elements while remaining highly visible.

**Action:** Implement glassmorphism for critical accessibility overlays and use negative `outline-offset` for pill-shaped buttons in header/footer contexts to maintain a clean, professional aesthetic without sacrificing keyboard discoverability.

## 2024-05-20 - Elevating Hero Title with AI-Inspired Gradient

**Learning:** A "modern AI look" often involves dynamic gradients and subtle animations that catch the eye without sacrificing legibility. By using a `variant` prop in the `Hero` component, we can isolate this high-impact styling to primary landing pages while maintaining the minimalist Northern Lights aesthetic for informational pages. Using theme variables (`--accent-regular`, `--accent-dark`, `--accent-light`) ensures the gradient scales across light and dark modes with optimal contrast.

**Action:** Introduced a `variant` prop to `Hero.astro` and implemented a dynamic `primary` title style featuring a shimmer-animated gradient (`135deg`, `var(--accent-regular)` to `var(--accent-dark)`). Updated `src/pages/index.astro` to use the `primary` variant for the main landing title.

## 2024-05-24 - Accessible Chat Overlay & Glassmorphic Polish

**Learning:** Interactive overlays (like chat windows) require robust focus management and state signaling via ARIA. Using `aria-expanded` and `aria-controls` explicitly links the trigger to the content for screen readers. Implementing a global `Escape` key listener and returning focus to the trigger element upon closing are critical patterns for maintaining navigational context in complex interfaces.

**Action:** Refactored `Chat.astro` to include semantic ARIA attributes and assigned `id="chat-window"` for accessibility compliance. Implemented a `setChatExpanded` helper to synchronize DOM state, manage focus transitions, and handle the `Escape` key shortcut. Enhanced the visual aesthetic with refined glassmorphism (increased blur/saturation) and a high-visibility `:focus-visible` state with a 4px offset.

## 2026-05-18 - Standardizing Focus Spatiality & Tactile Navigation

**Learning:** Standardizing interactive affordances across disparate components (Nav, Footer, Cards) creates a cohesive professional feel. A consistent `outline-offset: 4px` for focus states provides clear spatial feedback for keyboard users, while tactile `:active` transforms (`scale(0.97)`) offer physical responsiveness for touch and mouse users. Accessibility must be inclusive: `scroll-behavior: smooth` should always be gated by `prefers-reduced-motion` to prevent discomfort, and "Skip to Content" infrastructure requires site-wide `id="main-content"` consistency.

**Action:** Standardized `outline-offset: 4px` and tactile scaling across `Nav.astro`, `Footer.astro`, and global link styles. Refined `global.css` to gate smooth scrolling behind `prefers-reduced-motion: no-preference`. Ensured site-wide "Skip to Content" functionality by adding `id="main-content"` to all primary page layouts and components.

## 2026-05-19 - Optimizing LCP for Portfolio Galleries and Hero Assets

**Learning:** To optimize Largest Contentful Paint (LCP) in Astro projects, primary visual assets (like hero images) and the first items in repeated galleries should be prioritised by the browser. Applying `loading="eager"` and `fetchpriority="high"` to these elements prevents the browser from delaying their loading, ensuring a faster perceived performance for users.

**Action:** Enhanced the `PortfolioPreview` component to support dynamic `loading` and `fetchpriority` props. Updated `index.astro` and `work.astro` to prioritise the first project in their respective galleries. Explicitly added `loading="eager"` to the primary portrait image on the home page.
