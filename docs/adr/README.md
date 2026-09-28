# Architecture Decision Records (ADRs)

This directory contains Architecture Decision Records for the repository. ADRs document significant architectural decisions, codebase conventions, strategic technology shifts, and explicit directives for autonomous AI agents.

## ADR Index

| ID                                                                       | Title                                                         | Status   | Date       |
| :----------------------------------------------------------------------- | :------------------------------------------------------------ | :------- | :--------- |
| [0001](./0001-cloudflare-production-render-jules.md)                     | Cloudflare as Production and Render as Jules Test Environment | Accepted | 2026-08-24 |
| [0002](./0002-static-feature-flags-via-type-safe-content-collections.md) | Static Feature Flags via Type-Safe Content Collections        | Accepted | 2026-09-28 |

## Governance & Rules for AI Agents

1. **Sequential Indexing:** All ADRs must use sequential four-digit numbering (`NNNN-[title].md`).
2. **Master Index:** Every new ADR must be added to this index table.
3. **AI Directives:** Every ADR must contain an explicit "Directives for AI Agents" section with binary **Do** and **Don't** rules.
4. **Replacement Rule:** An ADR cannot be deleted or deprecated without linking its replacement ADR.
