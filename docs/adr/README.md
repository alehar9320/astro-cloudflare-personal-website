# Architecture Decision Records (ADR)

This directory contains sequence-numbered records of key architectural decisions made in the repository.

## Index

| ID                                                   | Title                                                       | Status   | Date       | Summary                                                                                           |
| ---------------------------------------------------- | ----------------------------------------------------------- | -------- | ---------- | ------------------------------------------------------------------------------------------------- |
| [0001](./0001-cloudflare-production-render-jules.md) | Cloudflare as Production, Render as Jules Test Environment  | Accepted | 2026-08-24 | Establishes Cloudflare Workers as production and Render as a Jules debugging testbed.             |
| [0002](./0002-static-prerendering-workers-assets.md) | Static Pre-Rendering with Cloudflare Workers Assets Binding | Accepted | 2026-10-08 | Codifies Astro static site generation (`output: 'static'`) and Workers + Assets deployment model. |

## Guidance for AI Agents & Developers

- Always review relevant ADRs before proposing architectural changes.
- Ensure any new ADR is assigned the next sequential integer (`NNNN`).
- Update this index whenever a new ADR is created, superseded, or updated.
- Strictly follow the **Directives for AI Agents** section in each ADR.
