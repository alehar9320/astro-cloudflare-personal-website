# Stratus Journal

## 2026-03-30 - Core Web Vitals, Non-Blocking Fonts & Edge Header Directives

### Core Web Vitals & Asset Pipeline

- **CLS Elimination:** Added explicit `width={1472}` and `height={871}` attributes to project cards (`PortfolioPreview.astro`) and project header images (`src/pages/work/[...slug].astro`) to allow the browser layout engine to compute aspect ratio boxes before image downloads finish, eliminating Cumulative Layout Shifts.
- **Render-Blocking Fonts Removal:** Refactored Google Fonts stylesheet link in `src/components/MainHead.astro` using DNS prefetching (`dns-prefetch`), preloads (`rel="preload" as="style"`), and non-blocking asynchronous swap (`onload="this.media='all'"` with `<noscript>` fallback). This removes external CSS parsing delays on critical FCP paths.

### Edge Caching & Cloudflare Pages Configuration

- **Cloudflare Pages Edge Directives (`public/_headers`):**
  - Applied long-term immutable caching (`Cache-Control: public, max-age=31536000, immutable`) for static assets in `/assets/*`.
  - Added baseline security headers (`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-XSS-Protection: 1; mode=block`) at the edge for `/*`.
- **Build Verification:** Verified build compilation (`dist/client/_headers`) confirming seamless merging of Astro generated asset cache directives with custom edge header rules.
