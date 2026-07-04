2026-05-03 - LCP Optimization for Hero Images
Learning: Above-the-fold images, such as the portrait hero on the home page and the main project image on work detail pages, are critical for Largest Contentful Paint (LCP). Explicitly setting fetchpriority="high" and decoding="async" ensures the browser prioritizes these assets, improving perceived and actual load performance.
Action: Added fetchpriority="high" and decoding="async" to the hero images in src/pages/index.astro and src/pages/work/[...slug].astro.

2026-05-30 - Icon Payload Pruning
Learning: Inlined SVG icons in Astro components contribute directly to the HTML payload size. Commenting out unused icons in a shared IconPaths configuration reduces the bytes served per page and the memory footprint of the Cloudflare Worker.
Action: Commented out unused icons in src/components/IconPaths.ts and updated related tests. Use grep -r to periodically audit icon usage across the codebase.

2026-06-15 - LCP Optimization: Preload & WebP Synchronization
Learning: When preloading hero images, the <link rel="preload"> href must exactly match the final <img> src (including dimensions, format, and optimization params). Using Astro's getImage() in the head slot ensures this synchronization. Failing to do so causes a "double download" where the browser preloads one version but renders another.
Action: Integrated getImage() in index.astro frontmatter for the hero image and passed its src to both the preload link and the <Image /> component. Reduced payload by ~82% (253KB to 45KB).
