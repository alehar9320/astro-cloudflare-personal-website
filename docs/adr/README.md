# Architecture Decision Records (ADRs)

This directory contains Architecture Decision Records (ADRs) for the repository. ADRs document significant architectural decisions, context, trade-offs, and explicit directives for human developers and autonomous AI agents.

## ADR Master Index

| ID                                                 | Title                                                                   | Status   | Date       | Summary                                                                                                                            |
| -------------------------------------------------- | ----------------------------------------------------------------------- | -------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| [0001](0001-cloudflare-production-render-jules.md) | Cloudflare as Production, Render as Jules Test Environment              | Accepted | 2026-08-24 | Production is Cloudflare Workers + Assets; Render is strictly a test environment for Google Jules debugging.                       |
| [0002](0002-strict-zod-schema-validation.md)       | Strict Zod Schema Validation for Content Collections and API Boundaries | Accepted | 2026-08-24 | All boundary inputs (content, env vars, edge APIs) must be validated with Zod schemas and TypeScript types inferred via `z.infer`. |

## ADR Lifecycle & Rules

1. **Sequential Numbering:** ADR files must strictly follow `NNNN-[title].md` format (e.g. `0001-...md`, `0002-...md`).
2. **Master Index Sync:** Every new, updated, or status-changed ADR must be reflected in the index table above.
3. **AI Agent Directives:** Every ADR must contain a `## Directives for AI Agents` section establishing explicit `Do` and `Don't` boundaries to prevent AI agent architectural drift.
4. **Non-Destructive Modifications:** ADRs must not be deleted or superseded without creating or linking the replacement ADR in the same change.
