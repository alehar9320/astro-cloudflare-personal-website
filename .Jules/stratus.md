# Stratus Journal

## 2026-09-20 - Edge Asset Caching & Hero Background Preloading
- **Benchmarked Shifts & LCP Improvements**: Preloaded the primary above-the-fold hero background images (`bg-main-dark-800w.jpg` and `bg-main-dark-1440w.jpg`) using `<link rel="preload" as="image" ...>` with viewport media queries in `MainHead.astro`. This allows the browser's preload scanner to discover critical LCP background images during initial HTML parsing before CSSOM construction completes.
- **Custom Edge Caching Strategy**: Added `public/_headers` to explicitly set `Cache-Control: public, max-age=31536000, immutable` for all static public assets under `/assets/*`. Astro's Cloudflare adapter merges `public/_headers` into `dist/client/_headers` alongside `/_astro/*`, ensuring Cloudflare Pages edge node caching for background images, stock assets, and noise overlays without origin revalidation.
- **Non-Render-Blocking Fonts**: Converted standard blocking Google Fonts stylesheet link in `MainHead.astro` to an asynchronous non-render-blocking pattern (`media="print" onload="this.media='all'"`) with a `<noscript>` fallback, removing Google Fonts CSS from the critical rendering path.
