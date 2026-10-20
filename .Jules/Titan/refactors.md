# Titan Refactors Journal

## HARD ABORT — no duplicate filing (owner lock 2026-10-20)

Read this before scouting. It overrides any idea below.

- Before you start, search this journal for an entry about the same idea, component, file or feature flag dated in the last 30 days.
- Also check for an existing branch or open PR for it: `git ls-remote --heads origin` and the open PR list.
- If either exists, stop and exit the cycle without opening a PR. Do not restack, re-file, re-date, rename or downscope it into a sibling pass.

Known repeats. Never file these again:

- Single-pass last-PR extraction, PR regex tweaks, or hoisting `Intl.DateTimeFormat` in `src/utils/visitor-changelog.ts` / `src/utils/whats-new-glance.ts`. Filed seven times across Engine, Bolt and Titan: #1690, #1715, #1716, #1729, #1730, #1731, #1743.
