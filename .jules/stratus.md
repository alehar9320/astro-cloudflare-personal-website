## 2025-06-09 - Edge & Asset Optimization

- **Edge Headers:** Implemented `public/_headers` with immutable caching (`max-age=31536000`) for all `/_astro/*` assets, reducing re-validation requests on Cloudflare Edge. Added essential security headers including CSP and Referrer-Policy.
- **Astro Assets:** Migrated project images to `src/assets/` and integrated Astro's `image()` schema helper and `<Image />` component. This ensures automated WebP conversion and prevention of CLS via explicit dimensions.
- **Passive Analytics:** Deferred PostHog initialization using `requestIdleCallback` to prioritize critical rendering path and improve initial page load performance.
