# Architecture Decision Records (ADR)

This directory contains key architectural decisions for the repository. ADRs document context, structural decisions, trade-off analysis, and actionable directives for both human developers and autonomous AI agents.

## Index

| ADR ID                                                   | Title                                                  | Status   | Date       |
| :------------------------------------------------------- | :----------------------------------------------------- | :------- | :--------- |
| [0001](0001-cloudflare-production-render-jules.md)       | Cloudflare as production, Render as Jules test env     | Accepted | 2026-08-24 |
| [0002](0002-static-feature-flags-content-collections.md) | Static Feature Flags via Type-Safe Content Collections | Accepted | 2026-09-27 |

---

## Directives for AI Agents

- All new ADRs MUST follow sequential 4-digit numbering (`0001`, `0002`, `0003`, ...).
- Every ADR MUST contain an explicit **Directives for AI Agents** section with binary `Do` and `Don't` rules.
- When adding or modifying an ADR, update the master index table in `docs/adr/README.md`.
