# Bolt Journal - Performance Optimizations

## 2026-07-04 - LCP Optimization: Hero Image Preload & WebP
Learning: Preloading hero images that are processed by Astro's Image component requires using the `getImage` function to obtain the final optimized URL for the `<link rel="preload">` tag. It is critical to align the `format` between `getImage` and the `<Image />` component to avoid double downloads.
Action: Always synchronize format, width, and height between `getImage` (for preloads) and the actual image component.
