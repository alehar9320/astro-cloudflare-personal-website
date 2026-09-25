# Architecture Decision Records (ADRs)

This directory documents the key architectural decisions, structural conventions, and strategic choices for Alexander Härenstam's personal portfolio repository.

## Index

| ID                                                          | Title                                                      | Status   | Date       | Summary                                                                                                      |
| ----------------------------------------------------------- | ---------------------------------------------------------- | -------- | ---------- | ------------------------------------------------------------------------------------------------------------ |
| [0001](./0001-cloudflare-production-render-jules.md)        | Cloudflare as Production, Render as Jules Test Environment | Accepted | 2026-08-24 | Establishes Cloudflare Workers as primary production and Render Node server as Jules agent test environment. |
| [0002](./0002-unified-workers-first-assets-architecture.md) | Unified Cloudflare Workers + Assets Architecture           | Accepted | 2026-03-29 | Codifies Cloudflare Workers + Assets binding (`wrangler.jsonc`) and static pre-rendering output model.       |

## ADR Lifecycle & Status Definitions

- **Accepted:** Active decision currently implemented in the codebase.
- **Proposed:** Strategic evolution or proposed structural shift awaiting implementation.
- **Superseded:** Replaced by a newer ADR (must link to replacement).
- **Deprecated:** Phased out and no longer applicable.

## Creating a New ADR

1. File naming convention: `docs/adr/NNNN-[kebab-case-title].md` (incrementing `NNNN` sequentially).
2. Follow the standard template defined in `0001` or `0002` including explicit **Directives for AI Agents**.
3. Update the index table in this `docs/adr/README.md` file.
