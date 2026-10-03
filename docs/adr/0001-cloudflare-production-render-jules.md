# 0001. Cloudflare as Production, Render as Jules Test Environment

- **Status:** Accepted
- **Date:** 2026-08-24
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

The site can build two ways: Cloudflare Workers (static + `@astrojs/cloudflare`) or a Node standalone server when `RENDER=true` (`@astrojs/node`). Production already runs at https://me.alehar.workers.dev/. We need a clear boundary so automated agents (e.g., Google Jules) can debug against a Node environment without treating that path as a second production environment or failover.

## Decision

Production deployment is strictly Cloudflare Workers (`wrangler.jsonc`, `src/cloudflare-worker.ts`). Render is strictly a test environment for Google Jules (Node server via `render.yaml`). Render is not a secondary production environment and not a failover target.

## Consequences & Tradeoffs

- **Positive:** Clear deployment boundary; eliminates architectural ambiguity when running test environments.
- **Negative / Risks:** Node test runtime may lack native Cloudflare Workers bindings (KV, AI), requiring fallback stubs (`src/env/cloudflare-workers.node.ts`).
- **Adoption Readiness:** Production is already active on Cloudflare Workers; test configuration is locked in `render.yaml`.

## Directives for AI Agents

- **Do:** Treat Cloudflare Workers + Assets as the sole canonical production target.
- **Don't:** Modify deployment routing or introduce multi-cloud failover logic that treats Render as production.
