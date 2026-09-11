# Architecture Decision Records (ADRs)

This directory contains Architecture Decision Records (ADRs) for Alexander Härenstam's personal portfolio repository. These records document established architectural decisions, conventions, and strategic proposals to govern human development and autonomous AI agent execution.

## ADR Index

| ID                                                                 | Title                                                                      | Status   | Date       | Description                                                                                    |
| ------------------------------------------------------------------ | -------------------------------------------------------------------------- | -------- | ---------- | ---------------------------------------------------------------------------------------------- |
| [0001](0001-cloudflare-production-render-jules.md)                 | Cloudflare Workers Production & Render Jules Test Environment              | Accepted | 2026-08-24 | Production runs strictly on Cloudflare Workers; Render Node server is an isolated AI test env. |
| [0002](0002-unified-cloudflare-workers-assets-static-prerender.md) | Unified Cloudflare Workers + Assets Architecture with Static Pre-rendering | Accepted | 2026-03-30 | Uses Astro static pre-rendering with Cloudflare Workers + Assets binding (`wrangler.jsonc`).   |

## Architecture Governance Rules for AI Agents

1. **Sequential ID Allocation:** All new ADRs must strictly use 4-digit sequential numbers (`0003`, `0004`, etc.).
2. **Template Compliance:** Every ADR must include Status, Date, Deciders, Context, Decision, Consequences & Tradeoffs, and "Directives for AI Agents".
3. **Master Index Synchronization:** Updating or adding an ADR requires immediately updating this `README.md` index table in the same PR.
4. **Deprecation Rules:** An ADR may only be marked `Superseded` or `Deprecated` if a replacement ADR is created or linked in the same change.
