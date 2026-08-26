2026-05-03 - LCP Optimization for Hero Images
Learning: Above-the-fold images, such as the portrait hero on the home page and the main project image on work detail pages, are critical for Largest Contentful Paint (LCP). Explicitly setting fetchpriority="high" and decoding="async" ensures the browser prioritizes these assets, improving perceived and actual load performance.
Action: Added fetchpriority="high" and decoding="async" to the hero images in src/pages/index.astro and src/pages/work/[...slug].astro.

2026-05-30 - Icon Payload Pruning
Learning: Inlined SVG icons in Astro components contribute directly to the HTML payload size. Commenting out unused icons in a shared IconPaths configuration reduces the bytes served per page and the memory footprint of the Cloudflare Worker.
Action: Commented out unused icons in src/components/IconPaths.ts and updated related tests. Use grep -r to periodically audit icon usage across the codebase.

2026-06-01 - Chat Avatar Deferred Image Decoding and Loading
Learning: Small component avatar images present in global layout components (like the Chat widget) can unnecessarily contend for network/decoding resources during initial page load. Explicitly adding loading="lazy" and decoding="async" prevents decoding/loading from blocking critical rendering path assets and initial paint.
Action: Added loading="lazy" and decoding="async" to src/components/Chat.astro avatar image.
