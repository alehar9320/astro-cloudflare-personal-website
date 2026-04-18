## 2025-05-15 - LCP Optimization & SVG Pruning

**Learning:** Adding `fetchpriority="high"`, `loading="eager"`, and `decoding="sync"` to hero images provides a measurable boost to LCP by signaling the browser to prioritize these assets. Pruning unused SVG paths from a centralized icon registry can significantly reduce the JS bundle size without affecting functionality.
**Action:** Always identify the LCP element on new pages and apply priority hints. Periodically audit `IconPaths.ts` using `grep` to ensure no dead weight is carried in the bundle.
