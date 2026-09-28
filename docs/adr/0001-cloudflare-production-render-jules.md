# 0001. Cloudflare as Production and Render as Jules Test Environment

- **Status:** Accepted
- **Date:** 2026-08-24
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

The site can build in two distinct deployment modes: Cloudflare Workers (static assets + `@astrojs/cloudflare`) or a Node standalone server when `RENDER=true` (`@astrojs/node`). Production is deployed at Cloudflare Workers (`https://me.alehar.workers.dev/`). We require a clear operational and deployment boundary so that automated testing environments (such as Google Jules) can run and debug against a Node environment without treating the Node server as a production deployment or failover target.

## Decision

- **Production Environment:** Strictly Cloudflare Workers (`wrangler.jsonc`, `src/cloudflare-worker.ts`).
- **Test Environment:** Render Node standalone server (`render.yaml`) reserved strictly for autonomous agent debugging and isolated node testing. It is not a secondary production cluster or failover destination.

## Consequences & Tradeoffs

- **Positive:** Clear deployment boundaries; production leverages Cloudflare's global edge network and native Workers KV / bindings; test environments retain simple Node runtime execution for debugging.
- **Negative / Risks:** Node test runtime lacks active Workers KV bindings and Cloudflare runtime contexts (stubbed via `src/env/cloudflare-workers.node.ts`).
- **Adoption Readiness:** Already active and implemented across `wrangler.jsonc`, `render.yaml`, and build configurations.

## Directives for AI Agents

- **Do:**
  - Treat Cloudflare Workers as the single source of truth for production configuration and edge deployment architecture.
  - Direct all edge runtime changes to `wrangler.jsonc` and `src/cloudflare-worker.ts`.
- **Don't:**
  - Do NOT add fallbacks or secondary routing logic treating Render as a production environment.
  - Do NOT introduce Node-only server runtime dependencies into edge production code.
