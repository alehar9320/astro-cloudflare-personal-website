2026-05-03 - LCP Optimization for Hero Images
Learning: Above-the-fold images, such as the portrait hero on the home page and the main project image on work detail pages, are critical for Largest Contentful Paint (LCP). Explicitly setting fetchpriority="high" and decoding="async" ensures the browser prioritizes these assets, improving perceived and actual load performance.
Action: Added fetchpriority="high" and decoding="async" to the hero images in src/pages/index.astro and src/pages/work/[...slug].astro.

2026-05-30 - Icon Payload Pruning
Learning: Inlined SVG icons in Astro components contribute directly to the HTML payload size. Commenting out unused icons in a shared IconPaths configuration reduces the bytes served per page and the memory footprint of the Cloudflare Worker.
Action: Commented out unused icons in src/components/IconPaths.ts and updated related tests. Use grep -r to periodically audit icon usage across the codebase.

2026-06-15 - Chat Avatar Image Lazy Loading
Learning: Global layout components like the Chat widget contain images (e.g., the 253KB portrait PNG avatar) that are not needed on initial page load when the chat is hidden or closed. Adding loading="lazy" and decoding="async" defers image fetching until required and avoids main-thread decoding contention during initial page render.
Action: Explicitly add loading="lazy" and decoding="async" to non-critical UI images embedded in global site components like Chat.astro.
