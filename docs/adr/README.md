# Architecture Decision Records (ADRs)

This directory contains the canonical Architecture Decision Records (ADRs) for Alexander Härenstam's portfolio codebase. ADRs document established architectural choices, strategic proposals, and explicit directives for human developers and autonomous AI agents.

## ADR Master Index

| ID                                                            | Title                                                                                              | Status     | Date       | Summary                                                                                                |
| ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ---------- | ---------- | ------------------------------------------------------------------------------------------------------ |
| [`0001`](./0001-cloudflare-production-render-jules.md)        | [Cloudflare as Production, Render as Jules Test Env](./0001-cloudflare-production-render-jules.md) | `Accepted` | 2026-08-24 | Production is Cloudflare Workers only; Render is strictly a Node test environment for Jules debugging. |
| [`0002`](./0002-workers-first-assets-binding-architecture.md) | [Workers-First Assets Binding Architecture](./0002-workers-first-assets-binding-architecture.md)   | `Accepted` | 2026-03-30 | Unified Cloudflare Workers + Assets binding model (`wrangler.jsonc`) replaces legacy Pages routing.    |

## Guidance for Autonomous AI Agents

- **Read ADRs before modifying architecture:** Every agent MUST respect the "Directives for AI Agents" section in each ADR.
- **Proposing Architectural Shifts:** Forward-looking technology shifts or structural additions must be authored as a new `Proposed` ADR in this directory.
- **Sequential Numbering:** ADR filenames must follow `NNNN-[kebab-case-title].md` format, zero-padded to 4 digits.
- **Master Index Synchronization:** Whenever a new ADR is created or its status changes, this `README.md` master index table must be updated.
