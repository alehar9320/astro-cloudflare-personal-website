## 2026-03-29 - Codify Workers-First Architecture and Tech Radar Ground-Truth

Learning: Established codebase conventions (Workers + Assets binding, static Astro prerendering, pure Vanilla CSS, Zod validation) were documented informally across `AGENTS.md` and skill files, but lacked formal ADR governance and a centralized Tech Radar index. This created potential context drift for autonomous AI agents.
Action: Formalized ADR `0001` and `0002`, established the master index in `docs/adr/README.md`, and codified the repository Tech Radar (`docs/tech-radar.md`) with explicit Directives for AI Agents to prevent non-compliant framework choices and operational ambiguity.
