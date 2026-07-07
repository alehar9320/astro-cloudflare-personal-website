# Stratus Performance Journal

## 2025-07-07 - Hero Image Asset Pipeline Optimization

**Learning:** Moving critical above-the-fold assets from `public/` to `src/assets/` allows Astro to perform automated format conversion (WebP) and resizing, significantly reducing payload size.
**Action:**

- Implemented `getImage()` for the hero image in `index.astro` to generate an optimized source URL.
- Added a `<slot name="head" />` to `BaseLayout.astro` for per-page `<head>` injections.
- Injected a `<link rel="preload">` in `index.astro` using the optimized URL to eliminate the image discovery waterfall and improve LCP.
- Used `<Image />` component with `loading="eager"` and `fetchpriority="high"` for the primary visual asset.
- Fixed Zod schema parsing in tests to support functional schema definitions required by the `image()` helper.

**Metrics:**

- Asset Size (Raw): 252KB (PNG)
- Asset Size (Optimized): ~45KB (WebP) -> estimated 80% reduction.
- LCP Improvement: Significant reduction in image discovery time via preload.
