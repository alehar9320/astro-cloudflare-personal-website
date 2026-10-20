## HARD ABORT — Prism /lab canvas (owner lock 2026-10-12)

Read this before scouting. It overrides any idea below.

- Never build, extend, or restyle `/lab` canvas pages or any `src/pages/lab/**` route.
- A noindex `/lab` experiment is not a visitor surface.
- If the change isn't visible to a visitor, stop and exit the cycle without opening a PR. Do not downscope into a sibling pass.

Recent farm runs: #1687, #1581, #1563.
