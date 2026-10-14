# Titan Refactors Journal

## 2026-03-31 - Hoist Intl.DateTimeFormat in whats-new-glance
- **Best Practice Applied:** Hoisting stateless `Intl.DateTimeFormat` utilities to module level avoids repeated object instantiation, locale parsing, and unnecessary memory allocations per function call.
- **Scope / Target:** `src/utils/whats-new-glance.ts`
- **Line Delta:** +12, -8 (net +4 lines)
- **Verification Status:** All tests passed (`src/__tests__/whats-new-glance.test.ts`), build and lint clean.
