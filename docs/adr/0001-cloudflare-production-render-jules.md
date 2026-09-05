# 0001. Cloudflare Workers as Production Environment and Render as Jules Test Environment

- **Status:** Accepted
- **Date:** 2026-08-24
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

The repository supports two build paths: Cloudflare Workers (static prerendering + `@astrojs/cloudflare`) and a Node standalone server when `RENDER=true` (`@astrojs/node`). Production is deployed to Cloudflare Workers (`https://me.alehar.workers.dev/`). To ensure predictable deployments and prevent dual-environment drift, a clear boundary is required so automated testing/debugging on Render (via `render.yaml`) does not get mistaken for a production deployment or failover target.

## Decision

Production is strictly deployed to Cloudflare Workers using the Workers-First model (`wrangler.jsonc`, `src/cloudflare-worker.ts`). Render is designated exclusively as a Node-based testing and execution environment for automated AI agents (Google Jules). Render is not a second production environment nor a failover target.

## Consequences & Tradeoffs

- **Positive:** Eliminates operational ambiguity; production features can leverage native Cloudflare Worker bindings (Workers AI, KV, Assets) without requiring full parity on Render.
- **Negative / Risks:** Render test environments require stubbing or mocking Cloudflare Workers ambient types and bindings (`src/env/cloudflare-workers.node.ts`).
- **Adoption Readiness:** Already active and proven in production operations.

## Directives for AI Agents

- **Do:** Operate and target Cloudflare Workers as the primary production runtime (`wrangler.jsonc`).
- **Do:** Use stubbed Workers bindings in `src/env/cloudflare-workers.node.ts` when running or testing under Node/Render mode (`RENDER=true`).
- **Don't:** Treat Render as a production or failover deployment target in documentation, scripts, or CI/CD pipelines.
- **Don't:** Modify production Cloudflare binding architecture to accommodate Node-only constraints.
