# 🌐 Stratus Journal - Edge & Performance

## 2025-06-23 - Implement astro:assets for high-performance image delivery

### Benchmarked shifts
- **LCP Optimization:** Core portfolio images (portrait, project thumbnails) now use Astro's `image-service`, generating optimized WebP assets.
- **Payload Reduction:** Automated generation of responsive images and modern formats (WebP) directly in the build pipeline.
- **CLS Prevention:** Explicit width/height enforcement through Astro's `<Image />` component.

### Discovered optimizations
- **Content Collection Integration:** Successfully integrated `image()` helper into the `work` collection schema, enabling type-safe, optimized images for dynamic content.
- **Mocking for Tests:** Refined content schema tests to handle Astro 6's functional schema definitions, ensuring 100% test coverage for validation logic.

### Action
- Migrated core assets from `public/assets/` to `src/assets/` to enable processing by Astro's asset pipeline.
- Updated `src/content.config.ts` and dynamic routes to leverage the `image` service.
- Refactored `index.astro`, `PortfolioPreview.astro`, and `[...slug].astro` to use the `<Image />` component.
