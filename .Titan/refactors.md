# Titan Refactors Journal

## 2026-06-25 - Content Schema Type Safety
- **File:** `src/__tests__/content.config.test.ts`
- **Improvement:** Resolved `ts(2339)` and `ts(18048)` errors.
- **Method:** Implemented standard pattern for testing Astro functional schemas by resolving with a mock context (including `image` helper) before validation.
- **Lines Changed:** +12, -3
- **Status:** Verified (astro check, vitest, build)

## 2026-06-25 - Eliminate Non-Null Assertions
- **File:** `src/utils/chat-logic.ts`
- **Improvement:** Removed unsafe `!` assertion in `pruneMessages`.
- **Method:** Added explicit null check for `pruned.shift()` result.
- **Lines Changed:** +4, -2
- **Status:** Verified (astro check, vitest, eslint, build)

## 2026-06-25 - Constant Clarity
- **File:** `src/utils/github-releases.ts`
- **Improvement:** Removed magic number in `CACHE_TTL`.
- **Method:** Introduced `ONE_HOUR_MS` constant.
- **Lines Changed:** +2, -1
- **Status:** Verified (astro check, vitest, eslint, build)

## 2026-06-25 - Fix Content Fetch Regression
- **File:** `src/pages/experimental/manifesto.astro`
- **Improvement:** Corrected `getEntry` call for flags.
- **Method:** Changed 'index' to 'config' to match the actual content file and prevent build warnings.
- **Lines Changed:** +1, -1
- **Status:** Verified (build)
