# Architecture Decision Records (ADRs)

This directory contains the sequential Architecture Decision Records (ADRs) for Alexander Härenstam's personal portfolio repository.

## Governance & Conventions

- ADRs document architectural decisions, patterns, structural trade-offs, and rules for human developers and autonomous AI agents.
- Every ADR contains explicit **Directives for AI Agents** to prevent architectural drift and enforce repo boundaries.
- Sequential numbering must strictly increment (`0001`, `0002`, `0003`, etc.).

## Master Index

| Number                                                     | Title                                                      | Status   | Date       | Summary                                                                                |
| :--------------------------------------------------------- | :--------------------------------------------------------- | :------- | :--------- | :------------------------------------------------------------------------------------- |
| [0001](./0001-cloudflare-production-render-jules.md)       | Cloudflare as Production, Render as Jules Test Environment | Accepted | 2026-08-24 | Designates Cloudflare Workers as sole production runtime and Render as Jules test env. |
| [0002](./0002-static-feature-flags-content-collections.md) | Static Feature Flags via Type-Safe Content Collections     | Accepted | 2026-08-24 | Gates experimental features using Zod-validated static JSON Content Collections.       |
