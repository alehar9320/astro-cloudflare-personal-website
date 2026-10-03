# Architecture Decision Records (ADRs)

This directory documents the key architectural decisions governing Alexander Härenstam's personal website portfolio.

## Index

| ADR                                                                      | Title                                                      | Status   | Date       |
| ------------------------------------------------------------------------ | ---------------------------------------------------------- | -------- | ---------- |
| [0001](./0001-cloudflare-production-render-jules.md)                     | Cloudflare as Production, Render as Jules Test Environment | Accepted | 2026-08-24 |
| [0002](./0002-static-feature-flags-via-type-safe-content-collections.md) | Static Feature Flags via Type-Safe Content Collections     | Accepted | 2026-08-24 |

## Governance & Conventions

- ADRs use sequential 4-digit numbering (`0001`, `0002`, etc.).
- Statuses: `Accepted`, `Proposed`, `Superseded`, `Deprecated`.
- Every ADR includes explicit "Directives for AI Agents" to enforce architectural boundaries and eliminate agent drift across the repository.
