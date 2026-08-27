# Architecture Decision Records (ADRs)

This directory contains the sequential Architecture Decision Records (ADRs) governing the technical architecture, operational boundaries, and AI agent directives for Alexander Härenstam's personal portfolio repository.

## Index

| ID                                                                         | Title                                                      | Status   | Date       | Summary                                                                                                                     |
| -------------------------------------------------------------------------- | ---------------------------------------------------------- | -------- | ---------- | --------------------------------------------------------------------------------------------------------------------------- |
| [0001](./0001-cloudflare-production-render-jules.md)                       | Cloudflare as Production, Render as Jules Test Environment | Accepted | 2026-08-24 | Production is strictly Cloudflare Workers + Assets; Render is a test environment for Google Jules.                          |
| [0002](./0002-strict-zod-schema-validation-and-zero-runtime-frameworks.md) | Strict Zod Schema Validation & Zero-Runtime UI Frameworks  | Accepted | 2026-03-30 | Enforce Zod schemas for all content/data validation and maintain zero-dependency Vanilla CSS & Astro static HTML rendering. |

## Process & Directives

All architectural decisions and proposals are managed by **Archie (Chief Architect)** and repository contributors.

- **Sequential Ordering:** New ADRs must increment sequentially (`0003`, `0004`, etc.).
- **Status Flags:**
  - `Accepted`: Production-proven active architectural decision.
  - `Proposed`: Forward-looking architectural shift awaiting implementation.
  - `Superseded`: Replaced by a newer ADR (must link replacement ADR).
  - `Deprecated`: Phased out without direct replacement.
- **AI Agent Directives:** Every ADR includes explicit "Directives for AI Agents" that all autonomous sub-agents MUST obey.
