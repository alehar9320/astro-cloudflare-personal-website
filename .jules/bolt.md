2026-05-03 - LCP Optimization for Hero Images
Learning: Above-the-fold images, such as the portrait hero on the home page and the main project image on work detail pages, are critical for Largest Contentful Paint (LCP). Explicitly setting fetchpriority="high" and decoding="async" ensures the browser prioritizes these assets, improving perceived and actual load performance.
Action: Added fetchpriority="high" and decoding="async" to the hero images in src/pages/index.astro and src/pages/work/[...slug].astro.

2026-05-30 - Icon Payload Pruning
Learning: Inlined SVG icons in Astro components contribute directly to the HTML payload size. Commenting out unused icons in a shared IconPaths configuration reduces the bytes served per page and the memory footprint of the Cloudflare Worker.
Action: Commented out unused icons in src/components/IconPaths.ts and updated related tests. Use grep -r to periodically audit icon usage across the codebase.

2026-06-13 - PostHog Deferred Initialization
Learning: Third-party analytics scripts like PostHog can be heavy (~185KB uncompressed) and block the main thread during initial page load. Deferring their initialization using requestIdleCallback ensures that critical rendering and interactive elements are prioritized, improving Total Blocking Time (TBT).
Action: Wrapped PostHog initialization in requestIdleCallback with a 3s setTimeout fallback in src/components/PostHog.astro.
