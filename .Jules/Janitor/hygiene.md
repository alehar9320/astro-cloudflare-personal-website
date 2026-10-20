# Janitor Hygiene Journal

## HARD ABORT — no duplicate filing (owner lock 2026-10-20)

Read this before scouting. It overrides any idea below.

- Before you start, search this journal for an entry about the same idea, component, file or feature flag dated in the last 30 days.
- Also check for an existing branch or open PR for it: `git ls-remote --heads origin` and the open PR list.
- If either exists, stop and exit the cycle without opening a PR. Do not restack, re-file, re-date, rename or downscope it into a sibling pass.

Known repeats. Never file these again:

- A "Typo & Terminology Alignment" journal row or PR with no real visitor-facing typo fixed. Already filed: #1709, #1751.
- Terminology passes on `docs/**` (ADRs, guidelines). Already filed: #1724, #1739.

---

| Date       | Corrected File                    | Correction                                                                               | Status      |
| :--------- | :-------------------------------- | :--------------------------------------------------------------------------------------- | :---------- |
| 2025-03-24 | N/A                               | Initialized Journal                                                                      | Initialized |
| 2025-03-24 | worker-configuration.d.ts         | Removed 'the the' typos from documentation comments                                      | Validated   |
| 2025-03-24 | context/author-linkedin.md        | Normalized Swedish terms (Produktchef, Produktledning) and removed duplicate text blocks | Validated   |
| 2025-03-24 | src/content/work/master-thesis.md | Improved grammatical phrasing in the concluding paragraph                                | Validated   |
| 2025-03-30 | src/components/Chat.astro, src/utils/chat-logic.ts | Normalized 'IFS design system' to 'IFS Design System' title case for repository-wide terminology alignment | Validated   |
| 2026-10-11 | src/ (visitor-facing copy)        | Scanned `src/content/**`, `src/pages/**`, and `src/components/**`; no visitor-facing typos found | Validated   |

## Spelling Exceptions

- Zod
- Vitest
- Cloudflare
- Astro
- LinkedIn
