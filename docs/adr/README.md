# Architecture Decision Records (ADR)

This directory contains sequence-numbered records of key architectural decisions for this repository.

| Index                                                | Title                                                      | Status   | Date       |
| :--------------------------------------------------- | :--------------------------------------------------------- | :------- | :--------- |
| [0001](./0001-cloudflare-production-render-jules.md) | Cloudflare as Production, Render as Jules Test Environment | Accepted | 2026-08-24 |
| [0002](./0002-workers-first-assets-architecture.md)  | Unified Cloudflare Workers + Assets Architecture           | Accepted | 2026-09-20 |

## Structure & Guidelines for AI Agents

All new ADRs must follow these rules:

1. File names must follow `NNNN-[title].md` in `docs/adr/`.
2. Every ADR must explicitly specify its `Status` (`Accepted`, `Proposed`, `Superseded`, or `Deprecated`).
3. Every ADR must include an explicit section: `## Directives for AI Agents` outlining strict `Do` and `Don't` guidelines.
4. Update this `README.md` index whenever an ADR is added, modified, or superseded.
