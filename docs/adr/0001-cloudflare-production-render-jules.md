# 0001. Cloudflare as Production, Render as Jules Test Environment

- **Status:** Accepted
- **Date:** 2026-08-24
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

The site can build two ways: Cloudflare Workers (static + `@astrojs/cloudflare`) or a Node standalone server when `RENDER=true` (`@astrojs/node`). Prod already runs on Cloudflare Workers (`wrangler.jsonc`, `src/cloudflare-worker.ts`). We need a clear split so Google Jules can debug against a Node environment without treating that path as a second production or failover target.

## Decision

Production is Cloudflare Workers only. Render is strictly a test environment for Google Jules (Node server via `render.yaml`). Render is NOT a second production target and NOT a failover target.

## Consequences & Tradeoffs

- **Positive:** Clear deployment boundary and simplified ops language. No split-brain production deployments or sync issues.
- **Negative / Risks:** Node debugging on Render lacks native Cloudflare bindings (AI, KV), requiring node fallback/mock modules (`src/env/cloudflare-workers.node.ts`).
- **Adoption Readiness:** Already active and implemented across CI/CD (`render.yaml`, `astro.config.mjs`, `wrangler.jsonc`).

## Directives for AI Agents

- **Do:** Treat Cloudflare Workers (`wrangler.jsonc`, `src/cloudflare-worker.ts`) as the single source of truth for production runtime and infrastructure.
- **Do:** Keep the Render configuration (`render.yaml`) strictly for Node-based debugging and testing by Google Jules.
- **Don't:** Add production deployment steps, failover logic, or secondary production targets pointing to Render.
- **Don't:** Expect native Cloudflare Worker bindings (AI, KV) to be present on Render without checking fallbacks in `src/env/cloudflare-workers.node.ts`.
