# 0001. Cloudflare as Production, Render as Jules Test Environment

- **Status:** Accepted
- **Date:** 2026-08-24
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

The repository supports two execution modes: Cloudflare Workers (static + `@astrojs/cloudflare`) and a Node standalone server when `RENDER=true` (`@astrojs/node`). Production is deployed to Cloudflare Workers (`me.alehar.workers.dev`). A clear boundary is required so automated AI test environments (e.g. Google Jules on Render) can debug against Node without mistaking that deployment path for a secondary production or failover target.

## Decision

Production is Cloudflare Workers only. Render is strictly a test and debugging environment for Google Jules running a Node standalone server via `render.yaml`. It is not a secondary production environment and not a failover target.

## Consequences & Tradeoffs

- **Positive:** Prevents split-brain architecture assumptions and clarifies edge runtime expectations vs Node fallback environments.
- **Negative / Risks:** Cloudflare Workers bindings (such as `AI` and `CHAT_STORE` KV) are missing or stubbed in the Node environment (`src/env/cloudflare-workers.node.ts`).
- **Adoption Readiness:** Already established in production; documented to align human developers and AI agents.

## Directives for AI Agents

- **Do:** Treat Cloudflare Workers (`wrangler.jsonc`, `src/cloudflare-worker.ts`) as the single source of truth for production runtime deployment.
- **Do:** Keep the Render Node fallback isolated strictly for Jules debugging and automated test environments.
- **Don't:** Modify routing logic, DNS, or deployment configurations assuming Render is a live production failover.
- **Don't:** Expect live Workers KV or Cloudflare AI bindings to be natively present in the Node test runtime without stubs.
