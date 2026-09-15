# Architecture Decision Records (ADRs)

This directory records key architectural decisions made in the development, operation, and governance of Alexander Härenstam's personal portfolio website and Cloudflare Workers infrastructure.

## Master Index

| ID                                                 | Title                                                                    | Status   | Date       |
| -------------------------------------------------- | ------------------------------------------------------------------------ | -------- | ---------- |
| [0001](0001-cloudflare-production-render-jules.md) | Cloudflare Workers as Production Environment and Render as Jules Testbed | Accepted | 2026-08-24 |
| [0002](0002-strict-zod-boundary-validation.md)     | Strict Zod Boundary Validation for External and Content Schemas          | Accepted | 2026-08-24 |

## Governance Rules

- All architectural changes, conventions, or strategic proposals must be documented as ADRs in this directory.
- ADRs must follow sequential numbering (`0001`, `0002`, `0003`, ...).
- Every ADR must include an explicit **Directives for AI Agents** section to prevent agent context drift across the codebase.
