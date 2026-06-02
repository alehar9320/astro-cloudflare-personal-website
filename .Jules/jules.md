## 2026-05-19 - Tactile & Portability | Signal: Technical | Lean Implementation: Flagged CSS + Locals Fallback

- [Insight 1: Deployment failures on Render caused by cloudflare:workers virtual module imports in shared code paths.]
- [Insight 2: Portfolio cards lack active tactile feedback, which can lead to perceived input lag on mobile.]
- [Lean Implementation: Used CSS transform :active for tactile feedback and Astro.locals for platform-agnostic env access.]

## 2026-05-26 - Portfolio Shimmer | Signal: Technical/Competitive | Lean Implementation: Flagged CSS Pseudo-element Animation

- [Insight 1: Shimmer micro-interactions provide high-quality visual feedback without increasing JS bundle size.]
- [Insight 2: Using `translateX` for the shimmer sweep is more performant than animating `background-position` as it avoids layout repaints.]
- [Delta: 18 lines. Guardrails: All passed autonomously.]

## 2026-06-02 - Interactive Pills | Signal: Competitive/UX | Lean Implementation: Flagged CSS Gradient & Transform Transition

- [Insight 1: Interactive elements should provide visual feedback on hover to improve affordance and perceived quality.]
- [Insight 2: Leveraging existing background-image gradients with background-position transitions is a low-cost way to add depth.]
- [Lean Implementation: Added `pill_hover_v1` flag, implemented background-position and transform transitions in Pill component.]
