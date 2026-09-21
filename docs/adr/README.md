# Architecture Decision Records (ADRs)

This directory contains the sequential Architecture Decision Records (ADRs) governing Alexander Härenstam's personal portfolio repository. ADRs record key architectural choices, trade-offs, and explicit directives for human developers and autonomous AI agents.

## Index

| ID                                                   | Title                                                                          | Status   | Date       | Summary                                                                                                                         |
| ---------------------------------------------------- | ------------------------------------------------------------------------------ | -------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------- |
| [0001](./0001-cloudflare-production-render-jules.md) | Cloudflare Workers as Production, Render Node Server as Jules Test Environment | Accepted | 2026-08-24 | Production runs exclusively on Cloudflare Workers; Render Node server is used solely for Google Jules test/debugging execution. |
| [0002](./0002-unified-workers-first-architecture.md) | Unified Workers-First Architecture and Static Pre-Rendering Strategy           | Accepted | 2026-03-30 | Cloudflare Workers + Assets binding model (`wrangler.jsonc`) with Astro static pre-rendering (`output: "static"`).              |

## ADR Lifecycle & Rules

1. **Sequential Naming:** ADRs must follow `NNNN-[title].md` format (e.g., `0003-zod-schema-validation.md`).
2. **Statuses:**
   - **Accepted:** Active architectural standard currently enforced in the codebase.
   - **Proposed:** Forward-looking architectural proposal under evaluation.
   - **Superseded:** Replaced by a newer ADR (must link replacement ADR).
   - **Deprecated:** Phased out without direct replacement.
3. **AI Agent Directives:** Every ADR must include actionable "Directives for AI Agents" specifying explicit `Do` and `Don't` guidelines to maintain repository boundaries.
