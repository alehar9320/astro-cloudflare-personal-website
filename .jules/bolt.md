2026-05-03 - LCP Optimization for Hero Images
Learning: Above-the-fold images, such as the portrait hero on the home page and the main project image on work detail pages, are critical for Largest Contentful Paint (LCP). Explicitly setting fetchpriority="high" and decoding="async" ensures the browser prioritizes these assets, improving perceived and actual load performance.
Action: Added fetchpriority="high" and decoding="async" to the hero images in src/pages/index.astro and src/pages/work/[...slug].astro.

2026-05-30 - Icon Payload Pruning
Learning: Inlined SVG icons in Astro components contribute directly to the HTML payload size. Commenting out unused icons in a shared IconPaths configuration reduces the bytes served per page and the memory footprint of the Cloudflare Worker.
Action: Commented out unused icons in src/components/IconPaths.ts and updated related tests. Use grep -r to periodically audit icon usage across the codebase.

2026-06-01 - Chat Avatar Deferred Loading
Learning: Offscreen assets rendered in floating widgets or drawer forms (such as the 250KB avatar image inside Chat.astro) can block critical network bandwidth if loaded eagerly on initial page load. Explicitly adding loading="lazy" and decoding="async" defers image fetching until the chat panel/form becomes visible or active.
Action: Added loading="lazy" and decoding="async" to the portrait image tag in src/components/Chat.astro.
