# Architecture Decision Records (ADRs)

This directory contains the sequential Architecture Decision Records (ADRs) for the Alexander Härenstam Personal Website repository (`astro-cloudflare-personal-website`).

ADRs document significant architectural decisions, codebase conventions, runtime trade-offs, and strategic technology shifts. Every ADR contains explicit **Directives for AI Agents** to ensure consistent agent execution and prevent architectural drift.

---

## Index of Architecture Decision Records

|                              Number                              | Title                                                                       |   Status   |    Date    |
| :--------------------------------------------------------------: | :-------------------------------------------------------------------------- | :--------: | :--------: |
|       [0001](./0001-cloudflare-production-render-jules.md)       | Cloudflare Workers Production Architecture with Node.js Render Test Sandbox | `Accepted` | 2026-08-24 |
| [0002](./0002-strict-zod-schema-validation-and-feature-flags.md) | Strict Zod Schema Validation for Content Collections and Feature Flags      | `Accepted` | 2026-08-24 |

---

## ADR Template Guidelines

When proposing or codifying new decisions, follow the standard template structure:

1. **Header:** Title formatted as `# NNNN. [Title]`, Status (`Accepted` | `Proposed` | `Superseded` | `Deprecated`), Date, Deciders.
2. **Context:** Problem statement and driving constraints.
3. **Decision:** Explicit rule, architecture, or pattern established.
4. **Consequences & Tradeoffs:** Positive outcomes, negative trade-offs, adoption readiness.
5. **Directives for AI Agents:** Binary **Do** and **Don't** rules enforceable by static analysis or automated tools.
