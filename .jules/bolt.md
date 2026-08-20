2026-05-03 - LCP Optimization for Hero Images
Learning: Above-the-fold images, such as the portrait hero on the home page and the main project image on work detail pages, are critical for Largest Contentful Paint (LCP). Explicitly setting fetchpriority="high" and decoding="async" ensures the browser prioritizes these assets, improving perceived and actual load performance.
Action: Added fetchpriority="high" and decoding="async" to the hero images in src/pages/index.astro and src/pages/work/[...slug].astro.

2026-05-30 - Icon Payload Pruning
Learning: Inlined SVG icons in Astro components contribute directly to the HTML payload size. Commenting out unused icons in a shared IconPaths configuration reduces the bytes served per page and the memory footprint of the Cloudflare Worker.
Action: Commented out unused icons in src/components/IconPaths.ts and updated related tests. Use grep -r to periodically audit icon usage across the codebase.

2026-06-12 - Universal Drawer Image Lazy Loading
Learning: Universal drawer or widget components included across all site pages (such as the Chat drawer avatar in BaseLayout) can trigger unnecessary early resource downloads if images lack lazy loading flags. Explicitly setting loading="lazy" and decoding="async" prevents high-resolution or secondary image assets from competing with LCP assets and main-thread layout work.
Action: Added loading="lazy" and decoding="async" to the avatar image in src/components/Chat.astro.
