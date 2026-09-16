# 0001. Cloudflare as Production, Render as Jules Test Env

- **Status:** Accepted
- **Date:** 2026-08-24
- **Deciders:** Repository Analysis / Architecture Governance

## Context

The site can build two ways: Cloudflare Workers (static + `@astrojs/cloudflare`) or a Node standalone server when `RENDER=true` (`@astrojs/node`). Prod already runs at https://me.alehar.workers.dev/. We need a clear split so Google Jules can debug against a Node environment without treating that path as a second production or failover.

## Decision

Production is Cloudflare Workers only. Render is a test environment for Google Jules (Node server via `render.yaml`). It is not a second prod and not a failover.

## Consequences & Tradeoffs

- **Positive:** Clear deployment target, preventing architectural split or dual-cloud maintenance complexity.
- **Negative / Risks:** Node environment on Render lacks native Cloudflare Workers KV/AI bindings, requiring fallback stubs (`src/env/cloudflare-workers.node.ts`).
- **Adoption Readiness:** Currently active and deployed in production.

## Directives for AI Agents

- **Do:** Ensure production builds target Cloudflare Workers (`wrangler.jsonc`, `src/cloudflare-worker.ts`).
- **Do:** Keep Render Node fallback code isolated strictly to testing and local debugging paths.
- **Don't:** Modify `wrangler.jsonc` or Cloudflare Worker deployment configurations assuming Node runtime APIs are available in production.
- **Don't:** Treat Render as a production failover or secondary production target.
