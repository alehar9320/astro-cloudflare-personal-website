# Sentinel's Journal

Security-focused logs and critical learnings for the Alexander Härenstam's portfolio.

Format: ## YYYY-MM-DD - [Title] | **Vulnerability:** [Insight] | **Prevention:** [Action]

## 2026-05-09 - Enhance Sentry client-side privacy | **Vulnerability:** Default Sentry client-side configuration could potentially leak PII through session replays and default event metadata. | **Prevention:** Explicitly disabled PII collection with `sendDefaultPii: false` and enabled strict masking/blocking (including `maskAllInputs`) for session replays in `sentry.client.config.ts`.

## 2026-04-25 - Resolve PostCSS XSS vulnerability | **Vulnerability:** PostCSS (versions < 8.5.10) had a moderate severity XSS vulnerability via unescaped `</style>` in its CSS stringify output (GHSA-qx2v-qp2m-jg93). | **Prevention:** Implemented a dependency override in `package.json` to force `postcss` version `^8.5.10`.

## 2026-04-11 - Resolve yaml vulnerability | **Vulnerability:** Moderate risk vulnerability in transitive dependency `yaml` (v2.0.0-2.8.2) through `@astrojs/check`, susceptible to Stack Overflow via deeply nested YAML collections (GHSA-48c2-rrv3-qjmp). | **Prevention:** Implemented a dependency override in `package.json` to force `yaml` version `^2.8.3`.

## 2026-04-10 - Mitigate XSS in Hero component | **Vulnerability:** Use of `set:html` with the `tagline` prop in `Hero.astro` allowed potential XSS if unvalidated input were passed to the component. While current usage was safe, it posed a risk for future changes. | **Prevention:** Replaced `set:html` with a named slot `<slot name="tagline" />` for rich content injection. The `tagline` prop now defaults to auto-escaped plain text.

## 2025-05-22 - Zod Runtime Validation Implementation | **Vulnerability:** Unvalidated external data and environment variables could lead to runtime errors or security issues if malformed data is processed. | **Prevention:** Introduced Zod for runtime schema validation of GitHub API responses and PostHog environment variables. Updated AI agent guardrails to enforce Zod runtime validation as a standard practice for all external and untrusted data.
