## HARD ABORT — inert pills (owner lock 2026-10-10)

Read this before scouting. It overrides any idea below.

- Never change `src/**/Pill.astro` or the case-study tag pills.
- No hover lift (`translateY`), glow, shadow, shimmer, gradient, sweep, tactile press, or any other motion on inert or non-interactive elements.
- Never add or flip any `enable_pill_*` feature flag.
- If your plan touches any of these, stop and exit the cycle without opening a PR. Do not downscope into a sibling pill pass.

Closed as farm: #1653, #1646, #1603, #1597, #1590, #1587, #1582, #1568, #1552, #1541.

---

## 2025-05-22 - Skills Pulse | Signal: Tech | Lean: Icon scale on hover.

## 2026-06-10 - Logo Wobble | Signal: Competitive | Lean Implementation: Added subtle ±10deg rotation on hover to the terminal icon in Nav.astro.

- Insight: Competitive signal from terminal-themed portfolios shows that micro-interactions on brand elements increase perceived playfulness and engagement.
- User Target: Joy
- Abort Triggers: None (verified via Playwright and build pipeline).
- User Reaction: Pending synthetic feedback.
