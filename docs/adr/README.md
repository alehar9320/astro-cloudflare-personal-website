# Architecture Decision Records (ADR)

This directory logs key architectural decisions for the repository. Every ADR documents architectural context, decision rationale, tradeoffs, and explicit **Directives for AI Agents** to govern autonomous code edits.

## Master Index

| Number                                                         | Title                                                                  | Status   | Date       |
| -------------------------------------------------------------- | ---------------------------------------------------------------------- | -------- | ---------- |
| [0001](./0001-cloudflare-production-render-jules.md)           | Cloudflare as Production Environment, Render as Jules Test Environment | Accepted | 2026-08-24 |
| [0002](./0002-static-feature-flags-via-content-collections.md) | Static Feature Flags via Type-Safe Content Collections                 | Accepted | 2026-08-25 |

## Format Guidelines

All new ADRs must:

1. Follow sequential numbering (`NNNN-[short-title].md`).
2. Be indexed in the table above.
3. Use the standard ADR template (`# NNNN. Title`, `Status`, `Date`, `Context`, `Decision`, `Consequences & Tradeoffs`, `Directives for AI Agents`).
4. Include explicit **Do** and **Don't** directives for AI agents.
