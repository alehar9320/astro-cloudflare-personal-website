## 2026-05-02 - Pruning Icon Bloat and LCP Optimization
**Learning:** Over-reliance on generic icon sets can lead to significant bundle bloat (~38% of IconPaths.ts was unused). Additionally, default "lazy" loading or missing fetch priority on "above-the-fold" content (like the hero portrait or project featured images) negatively impacts Largest Contentful Paint (LCP).
**Action:** Always audit `IconPaths.ts` for unused paths when finalizing PRs and ensure LCP images are explicitly marked with `fetchpriority="high"` and `decoding="async"`, avoiding `loading="lazy"`.
