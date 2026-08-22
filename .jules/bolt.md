2026-05-03 - LCP Optimization for Hero Images
Learning: Above-the-fold images, such as the portrait hero on the home page and the main project image on work detail pages, are critical for Largest Contentful Paint (LCP). Explicitly setting fetchpriority="high" and decoding="async" ensures the browser prioritizes these assets, improving perceived and actual load performance.
Action: Added fetchpriority="high" and decoding="async" to the hero images in src/pages/index.astro and src/pages/work/[...slug].astro.

2026-05-30 - Icon Payload Pruning
Learning: Inlined SVG icons in Astro components contribute directly to the HTML payload size. Commenting out unused icons in a shared IconPaths configuration reduces the bytes served per page and the memory footprint of the Cloudflare Worker.
Action: Commented out unused icons in src/components/IconPaths.ts and updated related tests. Use grep -r to periodically audit icon usage across the codebase.

2026-08-22 - Non-Critical Image Deferral & Social Icon Pruning
Learning: Components loaded in fixed or overlay containers (such as chat widgets) can contain images that block initial rendering or consume main-thread decoding time if not explicitly configured for deferred loading. Setting loading="lazy" and decoding="async" ensures non-critical avatars do not contend with hero assets.
Action: Added loading="lazy" and decoding="async" to the Chat.astro avatar and commented out unused social logo paths (instagram-logo, facebook-logo) in IconPaths.ts.
