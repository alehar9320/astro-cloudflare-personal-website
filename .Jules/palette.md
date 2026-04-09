## 2026-04-09 - Standardized Skip-to-Content and Glassmorphic Focus States
**Learning:** Standardizing accessibility targets (`id="main-content"`, `tabindex="-1"`) across all page layouts ensures a consistent UX for keyboard and screen reader users. In a glassmorphic design system, focus states should mirror the visual weight of hover effects to maintain aesthetic coherence.
**Action:** Always include `#main-content` targets in new Astro page templates and utilize `:focus-visible` to deliver high-visibility, glassmorphic feedback without cluttering the UI for mouse users.
