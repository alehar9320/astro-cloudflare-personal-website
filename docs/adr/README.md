# Architecture Decision Records (ADRs)

This directory contains the Architecture Decision Records for Alexander Härenstam's personal portfolio repository. Architectural governance is maintained by **Archie 🏛️**, the autonomous Chief Architect agent, alongside human developers.

## Index

| ID                                                             | Title                                                                     | Status   | Date       | Description                                                                                        |
| :------------------------------------------------------------- | :------------------------------------------------------------------------ | :------- | :--------- | :------------------------------------------------------------------------------------------------- |
| [0001](./0001-cloudflare-production-render-jules.md)           | Cloudflare Workers as Production, Render as Jules Test Environment        | Accepted | 2026-08-24 | Establishes Cloudflare Workers as canonical production and Render as Jules test host.              |
| [0002](./0002-workers-first-architecture-and-vanilla-stack.md) | Workers-First Astro Static Architecture and Zero-Dependency Vanilla Stack | Accepted | 2026-03-29 | Codifies static Astro pre-rendering on Cloudflare Workers, Vanilla CSS, and Zod schema validation. |

## Governance Rules

1. **Sequential ID Allocation:** ADR filenames strictly follow the sequential format `NNNN-[title].md` (e.g., `0001-...`, `0002-...`).
2. **Status Lifecycles:**
   - **`Accepted`:** Currently implemented and active pattern in the repository.
   - **`Proposed`:** Strategic shift, technology replacement, or structural change awaiting implementation.
   - **`Superseded`:** Replaced by a newer ADR (must link replacement ADR).
   - **`Deprecated`:** Retired architecture pattern (must link replacement context).
3. **AI Agent Enforcement:** Every ADR contains an explicit **Directives for AI Agents** section. All human contributors and autonomous AI agents (`Jules`, `Stratus`, `Prism`, `Kinetic`, `Vantage`, `Palette`, `Janitor`, `Apex`, `Engine`, `StuntDouble`, `ObservabilityClerk`) MUST adhere to these directives.
