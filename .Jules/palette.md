## 2026-04-10 - Skip to Content Accessibility

**Learning:** Adding a "Skip to Content" link is a fundamental accessibility requirement for keyboard users. Using `tabindex="-1"` on the target `<main>` element ensures focus is correctly managed across all browsers without adding the element to the natural tab order. For glassmorphic designs, the link should use `backdrop-filter: blur(10px)` and a high `z-index` to remain visible and readable over dynamic aurora backgrounds when focused.

**Action:** Standardized all page-level components with `<main id="main-content" tabindex="-1">` to support the global skip-link defined in `BaseLayout.astro`.
