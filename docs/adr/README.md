# Architecture Decision Records (ADRs)

This directory contains Architecture Decision Records (ADRs) for Alexander Härenstam's personal portfolio repository, governed autonomously by **Archie** (Chief Architect Agent).

## Master Index

| ADR                                                | Title                                                         | Status   | Date       |
| -------------------------------------------------- | ------------------------------------------------------------- | -------- | ---------- |
| [0001](0001-cloudflare-production-render-jules.md) | Cloudflare Production and Render Jules Test Environment       | Accepted | 2026-08-24 |
| [0002](0002-workers-first-astro-architecture.md)   | Workers-First Static Astro Architecture with Pure Vanilla CSS | Accepted | 2026-03-29 |

## Governance & Rules for AI Agents

1. **Sequential Naming:** ADR files MUST follow the pattern `NNNN-[short-kebab-title].md` (e.g. `0001-cloudflare-production-render-jules.md`).
2. **Template Compliance:** Every ADR MUST include Status, Date, Deciders, Context, Decision, Consequences & Tradeoffs, and explicit Directives for AI Agents.
3. **Index Synchronization:** Any addition, status change, or deprecation of an ADR MUST update this index table simultaneously.
4. **No Unlinked Supersession:** Never mark an ADR as `Superseded` or `Deprecated` without linking to its replacement record.
