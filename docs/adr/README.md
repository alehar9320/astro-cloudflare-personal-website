# Architecture Decision Records (ADR)

This directory contains Architecture Decision Records for the repository. Architecture decisions record key architectural choices, context, trade-offs, and rules for human developers and autonomous AI agents.

## Index

| Number                                               | Title                                                   | Status   | Date       |
| :--------------------------------------------------- | :------------------------------------------------------ | :------- | :--------- |
| [0001](./0001-cloudflare-production-render-jules.md) | Cloudflare as production, Render as Jules test env      | Accepted | 2026-08-24 |
| [0002](./0002-strict-zod-schema-validation.md)       | Strict Zod Schema Validation for Content & Runtime Data | Accepted | 2026-08-28 |

## ADR Rules & Guidelines

- ADR numbers MUST strictly increment sequentially (`0001`, `0002`, `0003`, etc.).
- Active/implemented codebase patterns MUST be marked as `Accepted`.
- Proposed architectural evolutions MUST be marked as `Proposed` and include readiness criteria and a migration path.
- Every ADR MUST include explicit **Directives for AI Agents** (`Do` and `Don't`).
- NEVER delete or overwrite ADRs. When deprecating or replacing an ADR, create the new ADR and update the former status to `Superseded` or `Deprecated` linking the replacement.
