# HARD ABORT — do not restack Dual / copy-this / Kinetic Pill farms

Read this before scouting. If the idea is one of these, ABORT the cycle. Do not downscope into a sibling with the same job. Do not open a PR.

Tonight's Jules feature-enhancement reads this file from main after Dual merge.

Do NOT restack:

- #867 ThemeToggle tactile (copy-this)
- #763 CTA tactile
- #868 (KEEP Dual CLOSED)
- #869 (KEEP Dual FAIL)
- Kinetic/Aurora/Jules Pill tactile farms (#959, #953, #899, #875, #860, #856, #851, #750)

Do not downscope into a sibling tactile, focus, image-dimension, or Pill-gradient pass of those jobs. Do not open a PR.

Prefer visitor-facing craft on live surfaces (Home, Work, Biography, Contact, and other shipped pages). Hire path is LinkedIn only. Do not invent a public email or CV.

---

## 2026-09-03 - Farm abort | Signal: Nick Eng FAIL #959 | Lean Implementation: HARD ABORT Pill tactile restack of #953/#899/#750

## 2026-09-01 - Farm abort | Signal: Dual merge + scheduled farm classes | Lean Implementation: HARD ABORT restack of #867/#763/#868/#869 and Kinetic Pill farms

## 2026-05-19 - Tactile & Portability | Signal: Technical | Lean Implementation: Flagged CSS + Locals Fallback

- [Insight 1: Deployment failures on Render caused by cloudflare:workers virtual module imports in shared code paths.]
- [Insight 2: Portfolio cards lack active tactile feedback, which can lead to perceived input lag on mobile.]
- [Lean Implementation: Used CSS transform :active for tactile feedback and Astro.locals for platform-agnostic env access.]

## 2026-05-26 - Portfolio Shimmer | Signal: Technical/Competitive | Lean Implementation: Flagged CSS Pseudo-element Animation

- [Insight 1: Shimmer micro-interactions provide high-quality visual feedback without increasing JS bundle size.]
- [Insight 2: Using `translateX` for the shimmer sweep is more performant than animating `background-position` as it avoids layout repaints.]
- [Delta: 18 lines. Guardrails: All passed autonomously.]

## 2026-06-02 - CallToAction Tactile Feedback | Signal: Competitive/Technical | Lean Implementation: Flagged CSS Transform :active

- [Insight 1: Adding instant hardware-accelerated press feedback (`transform: translateY(2px) scale(0.98)`) on CTA buttons eliminates perceived press latency.]
- [Insight 2: Scoping tactile feedback behind feature flags (`enable_cta_tactile_v1`) allows isolated deployment without global layout risk.]
- [Delta: 12 lines. Guardrails: All passed autonomously.]

## 2026-06-09 - Theme Toggle Tactile & Focus | Signal: Technical/Accessibility | Lean Implementation: Flagged CSS Motion Gate + Focus Alignment

- [Insight 1: Tighter focus ring outline-offsets (2px) prevent focus ring overflow clipping on compact overlay toggles.]
- [Insight 2: Gating active press scale transitions behind prefers-reduced-motion media queries respects accessibility preferences while preserving tactile visual feedback.]
- [Delta: 17 lines. Guardrails: All passed autonomously.]
