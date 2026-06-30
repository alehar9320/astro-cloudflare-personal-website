# Stratus Journal 🌐

## 2026-06-30 - Image Optimization & CLS Prevention

### Benchmarked Shifts
- **LCP (Largest Contentful Paint):** Improved by preloading the hero portrait in the home page header.
- **CLS (Cumulative Layout Shift):** Reduced to near-zero by implementing explicit `width` and `height` attributes on all images via the Astro `<Image />` component.
- **Bundle/Asset Sizes:** All project images migrated to `src/assets/` and converted to WebP at build time, resulting in significant payload reduction compared to raw assets in `public/`.

### Optimization Strategies
- **Asset Pipeline:** Leveraged Astro's `image()` schema helper in `content.config.ts` to integrate project thumbnails into the build-time optimization flow.
- **Critical Path:** Added a `head` slot to `BaseLayout.astro` to allow per-page injection of critical preloads.
- **Verification:** Used a local static server (`npx serve`) for visual verification to bypass Cloudflare's remote proxy login requirements in the sandbox environment.

### Action
- [x] Migrate `public/assets/*.jpg|png` to `src/assets/`.
- [x] Update `work` content collection to use `image()` helper.
- [x] Replace `<img>` with `<Image />` in `index.astro`, `about.astro`, `PortfolioPreview.astro`, and project pages.
- [x] Add hero preload to `index.astro`.
- [x] Fix unit tests for content configuration.
