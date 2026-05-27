# Titan Refactor Journal

## 2025-05-14 - Resolve Deprecations and Extract Constants

### Improvements

- **src/utils/github-releases.ts**:
  - Replaced deprecated `result.error.format()` with `result.error.issues` to align with the latest Zod API and resolve `astro check` warnings.
- **src/pages/api/chat.ts**:
  - Extracted hardcoded configuration values (Rate limit thresholds, TTL, AI model name, System Prompt) into named constants for better maintainability.

### Code Smell Metrics

- **Magic Numbers**: Reduced in `src/pages/api/chat.ts`.
- **Technical Debt**: Resolved Zod deprecation in `src/utils/github-releases.ts`.

### Verification Status

- `npm run format`: Pass
- `npm run lint`: Pass
- `npm run check`: Pass (Resolved 1 warning)
- `npm run test`: Pass (63/63 tests)
- `npm run build`: Pending (Part of pre-commit)
