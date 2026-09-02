# Archie Journal

## 2026-03-30 - Architecture Decision Records & Repository Tech Radar Initial Setup
Learning: Architectural context and unwritten repository patterns (such as Zod feature flag isolation and Cloudflare Workers production boundaries) were scattered across AGENTS.md, config files, and code. Lacking a centralized ADR directory and Tech Radar created potential context gaps and risk of AI agent drift.
Action: Established formal ADR governance structure with sequential ADRs (`docs/adr/0001-...` and `docs/adr/0002-...`), master index (`docs/adr/README.md`), and comprehensive Tech Radar (`docs/tech-radar.md`) with explicit AI Agent Directives to enforce repository guardrails.
