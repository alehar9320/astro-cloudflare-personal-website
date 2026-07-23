## 2026-05-19 - Tactile & Portability | Signal: Technical | Lean Implementation: Flagged CSS + Locals Fallback

- [Insight 1: Deployment failures on Render caused by cloudflare:workers virtual module imports in shared code paths.]
- [Insight 2: Portfolio cards lack active tactile feedback, which can lead to perceived input lag on mobile.]
- [Lean Implementation: Used CSS transform :active for tactile feedback and Astro.locals for platform-agnostic env access.]

## 2026-05-26 - Portfolio Shimmer | Signal: Technical/Competitive | Lean Implementation: Flagged CSS Pseudo-element Animation

- [Insight 1: Shimmer micro-interactions provide high-quality visual feedback without increasing JS bundle size.]
- [Insight 2: Using `translateX` for the shimmer sweep is more performant than animating `background-position` as it avoids layout repaints.]
- [Delta: 18 lines. Guardrails: All passed autonomously.]

## 2026-06-02 - Content Schema Type Safety | Signal: Technical | Lean Implementation: Mocked Context for Functional Astro Schemas

- [Insight 1: Astro schema validation tests fail types checks during `astro check` when schemas are declared as functions instead of pure Zod objects.]
- [Insight 2: By passing a minimal mock context to the schema function and utilizing targeted `@ts-expect-error` comments, we maintain strong test-level validation without resorting to broad `any` casts.]
- [Delta: 14 lines. Guardrails: All passed autonomously.]
