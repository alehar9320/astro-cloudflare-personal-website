# Architecture Decision Records (ADRs)

This directory contains Architecture Decision Records (ADRs) governing the strategic architectural evolution, infrastructure choices, and development conventions of this repository.

## Master Index

| NNNN                                                      | Title                                              | Status   | Date       |
| :-------------------------------------------------------- | :------------------------------------------------- | :------- | :--------- |
| [0001](./0001-cloudflare-production-render-jules.md)      | Cloudflare as Production, Render as Jules Test Env | Accepted | 2026-08-24 |
| [0002](./0002-workers-first-static-astro-architecture.md) | Workers-First Static Astro Architecture            | Accepted | 2026-03-30 |

## Guidance for Developers & AI Agents

- All architectural shifts, infrastructure updates, or pattern changes must be recorded as an ADR.
- Every ADR MUST include explicit **Directives for AI Agents** to maintain codebase integrity and prevent agent drift.
- When replacing or deprecating an existing decision, create a new ADR and update the status in this index accordingly.
