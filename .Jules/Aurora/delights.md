## HARD ABORT — inert pills (owner lock 2026-10-10)

Read this before scouting. It overrides any idea below.

- Never change `src/**/Pill.astro` or the case-study tag pills unless an owner-approved spec scopes it.
- No hover lift (`translateY`), glow, shadow, shimmer, gradient, sweep, tactile press, or any other motion on inert or non-interactive elements.
- An inert pill with a hover effect is a fake affordance: it looks clickable and isn't.
- Never add or flip any `enable_pill_*` feature flag.
- If your plan touches any of these, stop and exit the cycle without opening a PR. Do not downscope into a sibling pill pass.

Closed as farm: #1653, #1646, #1631, #1611, #1603, #1597, #1590, #1587, #1582, #1568, #1552, #1541.

---

## GUARD — orphaned components (Lead UX lock 2026-10-11)

Read this before proposing any visual or motion change to a component.

- First check that a routed page renders it: `rg -n "<ComponentName>" src/pages src/layouts` (and the layouts and components those pages import).
- If no live page renders the component, do not propose the change. Stop and exit the cycle without opening a PR.
- `src/components/PortfolioPreview.astro` is orphaned: no live page renders it, and `src/__tests__/identity.test.ts` forbids it on `/work/`. Do not polish it.

Wasted runs on orphaned components: #1676, #1683, #1125, #1339, #1351, #1363.

---

## 2025-05-22 - Skills Pulse | Signal: Tech | Lean: Icon scale on hover.

## 2026-06-10 - Logo Wobble | Signal: Competitive | Lean Implementation: Added subtle ±10deg rotation on hover to the terminal icon in Nav.astro.

- Insight: Competitive signal from terminal-themed portfolios shows that micro-interactions on brand elements increase perceived playfulness and engagement.
- User Target: Joy
- Abort Triggers: None (verified via Playwright and build pipeline).
- User Reaction: Pending synthetic feedback.

## 2026-10-11 - Social Bounce | Signal: Competitive | Lean Implementation: Added subtle translateY(-1px) and scale(1.05) on hover/focus-visible to header social icons in Nav.astro under enable_social_bounce_v1.

- Insight: Micro-interactions on header navigation controls provide tactile feedback and increase visual delight during user engagement.
- User Target: Joy
- Abort Triggers: None (verified via test and build pipeline).
