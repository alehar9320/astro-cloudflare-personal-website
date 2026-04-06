---
name: quality-assurance
description: Continuous verification through testing, linting, and formatting. Use before every commit or submission.
---

# Automated Quality Assurance

Ensure that all code changes meet the project's high standards for correctness and maintainability through the automated test suite and linting rules.

## When to use this skill

- Running Vitest suites (`npm test`).
- Checking and fixing linting issues (`npm run lint`).
- Applying and verifying Prettier formatting (`npm run format`).
- Monitoring code coverage (`npm run test:coverage`).

## How to use it

1. **Test-First Verification:** Proactively run existing Vitest suites and add new tests for critical features.
2. **Strict Formatting Compliance:** Always run `npm run format` before every commit. Non-compliant formatting will fail CI checks.
3. **Honest Coverage Metrics:** Maintain high code coverage across all source files, including `.astro` components, as defined in `vitest.config.ts`.
4. **Combined Quality Check:** Use `npm run format && npm run lint && npm run test` as a standard verification process.
