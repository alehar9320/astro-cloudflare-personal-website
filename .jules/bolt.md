2026-05-03 - LCP Optimization for Hero Images
Learning: Above-the-fold images, such as the portrait hero on the home page and the main project image on work detail pages, are critical for Largest Contentful Paint (LCP). Explicitly setting fetchpriority="high" and decoding="async" ensures the browser prioritizes these assets, improving perceived and actual load performance.
Action: Added fetchpriority="high" and decoding="async" to the hero images in src/pages/index.astro and src/pages/work/[...slug].astro.
2025-05-16 - Prune unused icons from IconPaths.ts
Learning: Maintaining a shared icon library can lead to bundle bloat if unused assets are not regularly audited. Since the iconPaths object is often imported as a whole, every unused path adds unnecessary bytes to the JavaScript payload.
Action: Audited icon usage across the codebase and removed 11 unused icons from src/components/IconPaths.ts, resulting in a ~38% file size reduction (9.1KB to 5.6KB).
