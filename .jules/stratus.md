# 🌐 Stratus Journal

## 2025-06-16 - PostHog & Asset Pipeline Optimization

### 🔍 Observe
- Identified that `posthog-js` (~185KB) was being initialized synchronously in the `<head>`, blocking the critical rendering path.
- Noticed that the main hero portrait (`/assets/portrait.png`, 253KB) was served as a raw unoptimized PNG from the `public/` directory, missing out on Astro's modern image optimization pipeline.

### 🎯 Select
- **PostHog Deferral**: Wrap PostHog initialization in `requestIdleCallback` and use dynamic imports to improve Total Blocking Time (TBT).
- **Hero Asset Pipeline**: Move the portrait to `src/assets/` and use Astro's `<Image />` component to serve optimized WebP/AVIF formats and reduce Largest Contentful Paint (LCP).

### ⚙️ Streamline
- Refactored `src/components/PostHog.astro` to use asynchronous initialization triggered by idle time or the `load` event.
- Migrated `public/assets/portrait.png` to `src/assets/portrait.png`.
- Refactored `src/pages/index.astro` to use `import { Image } from 'astro:assets'`.

### ✅ Verify
- `npm run build`: Success.
- Asset Analysis: `portrait.webp` generated (252kB - note: initial PNG was already somewhat compressed, but now served in a modern format with correct headers).
- PostHog Bundle: Now loaded via dynamic import, removing it from the initial critical JS payload.
- `npm run test`: All 94 tests passed.
- `npm run astro check`: 0 errors (after fixing legacy test type issues).

### 🎁 PR
`🌐 Stratus: Optimize PostHog delivery and Hero asset pipeline`
