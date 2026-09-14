# Titan Refactoring Journal

## 2026-03-29 - Zero-Allocation ISO Date Formatting & JSDoc Cleanup

- **Target File:** `src/utils/github-releases.ts`
- **Code Smell / Optimization:** Dynamic Array Allocation & Redundant JSDoc Types
- **Refactor:** Replaced `date.toISOString().split('T')[0]` with `date.toISOString().slice(0, 10)` inside `formatReleaseDate` to extract the `YYYY-MM-DD` substring directly without allocating a 2-element array. Cleaned up redundant explicit type tags in JSDoc annotations.
- **Line Delta:** -2 lines (15 insertions, 17 deletions in diff section; net -2 lines).
- **Verification:** `npm run test`, `npm run lint`, `npm run format:check`, `npm run astro check`, `npm run build` all passed cleanly with zero errors.
