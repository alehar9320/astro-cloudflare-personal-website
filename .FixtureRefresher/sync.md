# FixtureRefresher: Sync Log

| Date | Aligned Schemas | Altered Mock Files | Validation Compliance Rating |
| :--- | :--- | :--- | :--- |
| 2026-06-03 | `flags` collection (added `portfolio_tactile_v1`, `enable_strategic_pulse`, `portfolio_shimmer_v1`) | `src/__tests__/github-releases.test.ts` (updated tag to `2026.06.03.1841`) | 100% (All tests and Astro check passed) |

## Summary of Changes
- **Schema Alignment:** Synchronized `src/content.config.ts` with actual feature flag keys used in `flags.json`.
- **Infrastructure:** Migrated `src/content/flags.json` to `src/content/flags/config.json` to comply with Astro Content Collections.
- **Fixture Refresh:** Updated GitHub release mocks to match the latest repository state, ensuring deterministic test payloads.
- **Verification:** Verified frontend stability on `/experimental/now/` via Playwright.
