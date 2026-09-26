# Architecture Decision Records (ADR) Index

This directory contains sequential Architecture Decision Records (ADRs) governing the architectural boundaries, tech choices, and strategic evolutions of Alexander Härenstam's personal portfolio repository (`molecular-mars`).

## Master Index

| ADR Number                                            | Title                                                      | Status   | Date       | Deciders                                   |
| :---------------------------------------------------- | :--------------------------------------------------------- | :------- | :--------- | :----------------------------------------- |
| [0001](./0001-cloudflare-production-render-jules.md)  | Cloudflare as Production, Render as Jules Test Environment | Accepted | 2026-08-24 | Autonomous Architect / Repository Analysis |
| [0002](./0002-static-feature-flags-via-zod-schema.md) | Static Feature Flags via Type-Safe Content Collections     | Accepted | 2026-09-26 | Autonomous Architect (Archie)              |

---

## Governance Rules

1. **Sequential Naming:** Every ADR must follow `NNNN-[title].md` format (e.g. `0001-...md`, `0002-...md`).
2. **Explicit Directives for AI Agents:** Every ADR must contain an explicit `Directives for AI Agents` section with actionable `Do` and `Don't` guidelines.
3. **Master Index Sync:** Whenever an ADR is created, updated, or superseded, `docs/adr/README.md` must be updated in the same PR.
