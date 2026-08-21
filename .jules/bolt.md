2026-05-03 - LCP Optimization for Hero Images
Learning: Above-the-fold images, such as the portrait hero on the home page and the main project image on work detail pages, are critical for Largest Contentful Paint (LCP). Explicitly setting fetchpriority="high" and decoding="async" ensures the browser prioritizes these assets, improving perceived and actual load performance.
Action: Added fetchpriority="high" and decoding="async" to the hero images in src/pages/index.astro and src/pages/work/[...slug].astro.

2026-05-30 - Icon Payload Pruning
Learning: Inlined SVG icons in Astro components contribute directly to the HTML payload size. Commenting out unused icons in a shared IconPaths configuration reduces the bytes served per page and the memory footprint of the Cloudflare Worker.
Action: Commented out unused icons in src/components/IconPaths.ts and updated related tests. Use grep -r to periodically audit icon usage across the codebase.

2026-06-01 - Chat Avatar Image Decoding & Unused Icon Pruning
Learning: Non-critical avatar images in fixed floating components like chat forms should explicitly use loading="lazy" and decoding="async" to ensure they do not contend with main thread rendering during page load. Additionally, commenting out unused icon paths in shared SVG maps like IconPaths.ts eliminates dead payload from worker bundles and server-rendered HTML.
Action: Added loading="lazy" and decoding="async" to the Chat component avatar image and commented out unused instagram-logo and facebook-logo entries in src/components/IconPaths.ts.
