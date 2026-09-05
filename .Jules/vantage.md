# HARD ABORT — Titan/Vantage type-guard / Astro check farm

Read this before scouting. If the idea is one of these, ABORT the cycle. Do not downscope into a sibling with the same job. Do not open a PR.

If the idea is resolving type diagnostics, Astro check errors, type-guard refactors, or a sibling Titan/Vantage type-cleanup pass of the same class, ABORT.

Do NOT recreate:

- Vantage type diagnostics / Astro check error sweeps
- Titan/Vantage type-guard farms
- sibling type-cleanup restacks of the same class

Already closed as farm: #995, #422.

Leftover quota stays off this class (Riley ≥80 only elsewhere). Do not reopen as Jules.

Prefer visitor-facing craft on live surfaces (Home, Work, Biography, Contact, and other shipped pages). Hire path is LinkedIn only. Do not invent a public email or CV.

---

## 2026-09-04 - Farm abort | Signal: Nick CLOSED #995 | Lean Implementation: HARD ABORT Titan/Vantage type-guard farm (#422 class)

# HARD ABORT — visits-API tests

Read this before scouting. If the idea is one of these, ABORT the cycle. Do not downscope into a sibling with the same job. Do not open a PR.

If the idea is expanding visits API / PostHog visits branch coverage, hardening visits-API tests, or a sibling coverage pass on that endpoint, ABORT.

Do NOT recreate:

- visits API branch test coverage expansions
- PostHog visits API hardening of the same class

Already closed as farm: #876, #859.

Prefer visitor-facing craft on live surfaces (Home, Work, Biography, Contact, and other shipped pages). Hire path is LinkedIn only. Do not invent a public email or CV.

---

## 2026-09-01 - Farm abort | Signal: Nick close-reason split | Lean Implementation: HARD ABORT visits-API tests

## 2026-04-08 - Enforcing Mandatory Alt Text and Increasing Release Coverage | **Learning:** Accessibility must be enforced at the schema level to prevent regression, and API error states often represent significant coverage gaps. | **Action:** Removed `.optional()` from `img_alt` in `src/content.config.ts` and added a test case for non-OK GitHub API responses in `src/__tests__/github-releases.test.ts`.

## 2026-04-10 - Silencing Compiler Hints on JSON-LD Scripts | **Learning:** The Astro compiler treats scripts with attributes as processed by default; adding the `is:inline` directive for JSON-LD blocks clarifies intent and silences linting hints. | **Action:** Added `is:inline` to the `<script type="application/ld+json">` tags in `src/pages/about.astro` and `src/pages/work/[...slug].astro`.

## 2026-04-12 - Increasing Branch Coverage for GitHub Utilities | **Learning:** Environmental isolation in tests (e.g., mocking `process` or `process.env`) is critical for verifying logic intended for diverse runtimes like Cloudflare Workers. | **Action:** Added unit tests to `src/__tests__/github-releases.test.ts` to cover authorization headers, rate limit logging, and normalization edge cases, achieving 100% branch coverage.

## 2026-04-15 - Adding Production Start Command for Render | **Learning:** Render expects a standard `npm start` hook for SSR web services; for Astro with the Node adapter in standalone mode, this is achieved by executing the server entry point directly with Node. | **Action:** Added `"start": "node ./dist/server/entry.mjs"` to `package.json` to ensure seamless deployment on Render.

## 2026-04-30 - Consolidating Sentry Configuration and Achieving 100% Branch Coverage | **Learning:** Consolidating configurations into the project root prevents logic drift and ensures standard Astro integration behavior, while dynamic imports with query strings are essential for isolating environment-sensitive modules in Vitest. | **Action:** Removed redundant `src/sentry.client.config.ts` and achieved 100% branch coverage for root Sentry configs and release scripts.

## 2026-05-05 - Implementing Persistent AI Quality Guardrails | **Learning:** AI agents require explicit, file-based protocols to maintain repository integrity and prevent unverified code from being committed. | **Action:** Created `.aiconfig.md` containing a mandatory four-stage Quality Pipeline (Format, Lint, Check, Test) to be executed before every push.

## 2026-05-15 - Standardizing Telemetry Resilience and Verifying Infrastructure Mocks | **Learning:** Telemetry must capture the full context of unknown errors via `String(e)` to avoid masking failure signals, and re-exporting mocks requires explicit execution to register in coverage reports. | **Action:** Updated `src/utils/github-releases.ts` to use `String(error)` in catch blocks and added an `exerciseMock` helper to `src/__tests__/mocks/astro-zod.ts` to achieve 100% coverage.

## 2026-05-20 - Hardening Telemetry Verification and Refining Stream Types | **Learning:** Index-based assertions in telemetry tests are brittle; using `.find()` ensures robust verification. Standardizing on `String(error)` across all API catch blocks prevents context loss during failure events. | **Action:** Refactored `chat-api.test.ts` and `github-releases.test.ts` to use search-based spy assertions, and added explicit return types to `chat-stream.ts` to resolve Astro compiler hints.
