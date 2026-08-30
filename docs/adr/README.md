# Architecture Decision Records (ADR)

This directory contains records of key architectural decisions made for the repository. Architecture Decision Records (ADRs) document technical context, decision rationales, accepted tradeoffs, and actionable directives for both human software engineers and autonomous AI agents.

## ADR Index

| ID                                                 | Title                                                          | Status   | Date       |
| :------------------------------------------------- | :------------------------------------------------------------- | :------- | :--------- |
| [0001](0001-cloudflare-production-render-jules.md) | Cloudflare as Production and Render as Jules Test Environment  | Accepted | 2026-08-24 |
| [0002](0002-schema-first-validation-with-zod.md)   | Schema-First Validation with Zod at Content and API Boundaries | Accepted | 2026-08-30 |

## Structure & Guidelines

All ADRs follow the standard template structure:

1. **Header & Status:** Sequential numbering (`NNNN-[title].md`), status (`Accepted`, `Proposed`, `Superseded`, `Deprecated`), date, deciders.
2. **Context:** Problem statement, constraints, or drivers.
3. **Decision:** Concrete architectural rule or change.
4. **Consequences & Tradeoffs:** Positive benefits, accepted risks/costs, adoption readiness.
5. **Directives for AI Agents:** Enforceable **Do** and **Don't** rules to maintain repository boundaries and prevent agent drift.
