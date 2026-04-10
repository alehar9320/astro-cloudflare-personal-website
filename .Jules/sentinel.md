# Sentinel's Journal

Security-focused logs and critical learnings for the Alexander Härenstam's portfolio.

Format: ## YYYY-MM-DD - [Title] | **Vulnerability:** [Insight] | **Prevention:** [Action]

## 2026-04-10 - Mitigate XSS in Hero component | **Vulnerability:** Use of `set:html` with the `tagline` prop in `Hero.astro` allowed potential XSS if unvalidated input were passed to the component. While current usage was safe, it posed a risk for future changes. | **Prevention:** Replaced `set:html` with a named slot `<slot name="tagline" />` for rich content injection. The `tagline` prop now defaults to auto-escaped plain text.
