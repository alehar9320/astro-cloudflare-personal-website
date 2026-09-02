2026-05-03 - LCP Optimization for Hero Images
Learning: Above-the-fold images, such as the portrait hero on the home page and the main project image on work detail pages, are critical for Largest Contentful Paint (LCP). Explicitly setting fetchpriority="high" and decoding="async" ensures the browser prioritizes these assets, improving perceived and actual load performance.
Action: Added fetchpriority="high" and decoding="async" to the hero images in src/pages/index.astro and src/pages/work/[...slug].astro.

2026-05-30 - Icon Payload Pruning
Learning: Inlined SVG icons in Astro components contribute directly to the HTML payload size. Commenting out unused icons in a shared IconPaths configuration reduces the bytes served per page and the memory footprint of the Cloudflare Worker.
Action: Commented out unused icons in src/components/IconPaths.ts and updated related tests. Use grep -r to periodically audit icon usage across the codebase.

2026-08-29 - In-Viewport Decoding & Icon Pruning
Learning: Docked composer avatars on first paint sit in-viewport inside the bottom chat bar. Using loading="lazy" on in-viewport images can cause blank flashes; using decoding="async" offloads image decoding from the main thread without deferring fetch. Unused SVG icon paths in IconPaths.ts can be safely commented out to prune bundle size.
Action: Retained decoding="async" on the chat avatar image in src/components/Chat.astro (omitting loading="lazy") and commented out unused instagram-logo and facebook-logo paths in src/components/IconPaths.ts.

2026-08-31 - Lazy Loading Below-The-Fold Case Study Image
Learning: Case study content images rendered below the fold (such as the main image in ifs-design-system) do not block initial LCP or first paint. Adding loading="lazy" allows the browser to defer network fetching until the user scrolls near the element, conserving bandwidth and offloading decoding during page load.
Action: Added loading="lazy" and decoding="async" to the below-the-fold case study image in src/pages/work/[...slug].astro.

2026-09-01 - Explicit Image Dimensions for Zero CLS
Learning: Adding explicit width and height attributes to non-responsive / fixed-ratio content images allows browsers to compute intrinsic aspect ratio boxes before image data arrives, completely eliminating Cumulative Layout Shift (CLS=0) during lazy loading.
Action: Added width="1472" and height="871" attributes to the case study image in src/pages/work/[...slug].astro.

2026-09-15 - Icon Pruning & Direct Inlining in ContactCTA
Learning: Inlining single-use icon paths directly into component templates (such as paper-plane-tilt in ContactCTA.astro) allows removing the path string from IconPaths.ts, pruning unnecessary dictionary lookup overhead and reducing bundle size across all pages that import IconPaths.ts.
Action: Inlined paper-plane-tilt SVG directly in src/components/ContactCTA.astro and commented out paper-plane-tilt in src/components/IconPaths.ts.
