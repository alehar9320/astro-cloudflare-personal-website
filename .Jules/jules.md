## 2026-05-19 - Tactile & Portability | Signal: Technical | Lean Implementation: Flagged CSS + Locals Fallback

- [Insight 1: Deployment failures on Render caused by cloudflare:workers virtual module imports in shared code paths.]
- [Insight 2: Portfolio cards lack active tactile feedback, which can lead to perceived input lag on mobile.]
- [Lean Implementation: Used CSS transform :active for tactile feedback and Astro.locals for platform-agnostic env access.]

## 2026-05-26 - Portfolio Shimmer | Signal: Technical/Competitive | Lean Implementation: Flagged CSS Pseudo-element Animation

- [Insight 1: Shimmer micro-interactions provide high-quality visual feedback without increasing JS bundle size.]
- [Insight 2: Using `translateX` for the shimmer sweep is more performant than animating `background-position` as it avoids layout repaints.]
- [Delta: 18 lines. Guardrails: All passed autonomously.]

## 2026-05-28 - Quieter Home First Viewport | Signal: Product/UX | Lean Implementation: Full Viewport Height Adjustment

- [Insight 1: Setting dynamic viewport units (`min-height: calc(100dvh - header_height)`) on the `.hero` container reliably pushes secondary cards and the site footer below the initial fold on both mobile and desktop screens.]
- [Insight 2: Centering hero flex content vertically within `100dvh` creates a balanced, quieter initial view without requiring structural DOM changes.]
- [Delta: ~12 lines modified in `src/pages/index.astro`. Guardrails: All passed.]
