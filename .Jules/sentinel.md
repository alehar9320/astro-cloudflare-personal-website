# Sentinel's Journal

Security-focused logs and critical learnings for the Alexander Härenstam's portfolio.

Format: ## YYYY-MM-DD - [Title] | **Vulnerability:** [Insight] | **Prevention:** [Action]

## 2026-04-10 - Mitigate XSS in Hero component | **Vulnerability:** Use of `set:html` with the `tagline` prop in `Hero.astro` allowed potential XSS if unvalidated input were passed to the component. While current usage was safe, it posed a risk for future changes. | **Prevention:** Replaced `set:html` with a named slot `<slot name="tagline" />` for rich content injection. The `tagline` prop now defaults to auto-escaped plain text.

## 2026-04-11 - Resolve yaml vulnerability | **Vulnerability:** Moderate risk vulnerability in transitive dependency `yaml` (v2.0.0-2.8.2) through `@astrojs/check`, susceptible to Stack Overflow via deeply nested YAML collections (GHSA-48c2-rrv3-qjmp). | **Prevention:** Implemented a dependency override in `package.json` to force `yaml` version `^2.8.3`.

## 2026-04-12 - Consolidate Sentry client configuration and enforce privacy standards | **Vulnerability:** Redundant and inconsistent Sentry client configuration across the repository posed a risk of privacy leaks (PII) and inconsistent error tracking if the wrong file was modified or prioritized during bundling. | **Prevention:** Consolidated Sentry client configuration into a single root-level file, enforced strict privacy standards (disabling PII collection and masking all Session Replay data), and updated unit tests to verify these settings.
