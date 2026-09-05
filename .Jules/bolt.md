# HARD ABORT — lazy IFS / below-fold case-study image

Read this before scouting. If the idea is one of these, ABORT the cycle. Do not downscope into a sibling with the same job. Do not open a PR.

If the idea is `loading="lazy"` on the below-the-fold IFS / case-study image, restacking that lazy-load, or re-doing explicit image dimensions, ABORT.

Do NOT recreate:

- lazy load on the below-the-fold case-study image (`ifs-design-system` / `work/[...slug]`)
- a restack of merged lazy-IFS / case-study image work
- re-doing merged image width/height

Merged #852/#868 done. Do not restack #868 (KEEP Dual CLOSED).

Already closed as farm / merged done: #852, #868.

Prefer visitor-facing craft on live surfaces (Home, Work, Biography, Contact, and other shipped pages). Hire path is LinkedIn only. Do not invent a public email or CV.

---

## 2026-09-01 - Farm abort | Signal: Nick close-reason split | Lean Implementation: HARD ABORT lazy IFS / below-fold case-study image work

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

2026-09-03 - Dynamic Import for Analytics Code-Splitting
Learning: Top-level static imports of third-party libraries (e.g. posthog-js) force Vite to include them in the entry client bundle on all page renders, even when activation conditions (e.g. API keys) are absent. Using dynamic import (`await import(...)`) behind conditional runtime checks isolates heavy analytics dependencies into deferred chunks, preventing main-thread parse/execution overhead on critical page loads.
Action: Updated src/components/PostHog.astro to dynamically import posthog-js only when PUBLIC_POSTHOG_KEY is present, reducing initial PostHog script payload from 240.6KB to 2.1KB (~238.5KB savings).

2026-09-04 - Conditional Icon Gradient Generation & Zero CLS Dimensions
Learning: Unconditional generation of random gradient IDs (`Math.random()`, `.toString(36)`) on non-gradient SVG icon renders wastes CPU cycles during SSR/prerendering. Additionally, missing explicit `width` and `height` attributes on content image tags causes Cumulative Layout Shift (CLS) when images load.
Action: Updated `Icon.astro` to generate `gradientId` only when `gradient` prop is true, and added explicit `width="1472"` and `height="871"` attributes to hero images in `work/[...slug].astro` and `PortfolioPreview.astro`.
