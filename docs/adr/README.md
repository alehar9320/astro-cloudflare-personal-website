# Architecture Decision Records (ADR)

This directory tracks the architectural decision records for Alexander Härenstam's personal portfolio repository.

## Master ADR Index

| ADR                                                | Title                                                      | Status   | Date       | Summary                                                                                                                                   |
| -------------------------------------------------- | ---------------------------------------------------------- | -------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| [0001](0001-cloudflare-production-render-jules.md) | Cloudflare as Production, Render as Jules Test Environment | Accepted | 2026-08-24 | Production runs strictly on Cloudflare Workers; Render serves as a Node test environment for AI agent debugging.                          |
| [0002](0002-workers-first-assets-architecture.md)  | Unified Workers-First Architecture with Cloudflare Assets  | Accepted | 2026-03-30 | Adopts Cloudflare Workers + Assets (`wrangler.jsonc`) as the unified production runtime for static assets and edge worker dynamic routes. |

## Guidance for Developers and AI Agents

- All architectural shifts, tech replacements, or structural decisions must be recorded as ADRs in this directory following sequential numbering (`NNNN-[title].md`).
- Every ADR must include an explicit **Directives for AI Agents** section defining binary `Do` and `Don't` boundaries.
- The master index table in this `README.md` must be kept in sync whenever an ADR is added, updated, or superseded.
