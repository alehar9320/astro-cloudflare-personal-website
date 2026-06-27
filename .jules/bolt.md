2026-05-03 - LCP Optimization for Hero Images
Learning: Above-the-fold images, such as the portrait hero on the home page and the main project image on work detail pages, are critical for Largest Contentful Paint (LCP). Explicitly setting fetchpriority="high" and decoding="async" ensures the browser prioritizes these assets, improving perceived and actual load performance.
Action: Added fetchpriority="high" and decoding="async" to the hero images in src/pages/index.astro and src/pages/work/[...slug].astro.

2026-05-30 - Icon Payload Pruning
Learning: Inlined SVG icons in Astro components contribute directly to the HTML payload size. Commenting out unused icons in a shared IconPaths configuration reduces the bytes served per page and the memory footprint of the Cloudflare Worker.
Action: Commented out unused icons in src/components/IconPaths.ts and updated related tests. Use grep -r to periodically audit icon usage across the codebase.

2026-06-12 - Build-time Data Fetching for GitHub Releases
Learning: Moving client-side data fetching for version info and release logs to Astro's build-time frontmatter eliminates substantial JS dependencies (like Zod) from the client bundle. An in-memory cache in the shared utility prevents redundant API calls during the static build process when multiple components (Footer, What's New page) consume the same data.
Action: Converted Footer.astro and src/pages/whats-new.astro to fetch data during build. Added a buildTimeCache to src/utils/github-releases.ts. This reduced the client-side JS payload by ~63KB and improved the "What's New" page LCP by removing the loading state.
