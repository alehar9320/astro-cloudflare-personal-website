# 0001. Cloudflare Workers as Production, Render as Jules Test Environment

- **Status:** Accepted
- **Date:** 2026-08-24
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

The personal portfolio site can be configured to build using two adapters: Cloudflare Workers (SSR/static + `@astrojs/cloudflare`) or a Node standalone server when `RENDER=true` (`@astrojs/node`). Production already runs on Cloudflare Workers (`https://me.alehar.workers.dev/`). A clear architectural split is required so autonomous agents (such as Google Jules) can test and debug against a Node environment without misinterpreting the Node build target as a secondary production environment or failover deployment.

## Decision

Production is strictly Cloudflare Workers. Render serves exclusively as a test environment for autonomous AI agents (Node server via `render.yaml`). It is neither a secondary production host nor a failover mechanism.

## Consequences & Tradeoffs

- **Positive:** Clear deployment boundaries prevent architectural confusion across production and test environments. Production leverages edge capabilities (Cloudflare Workers KV, AI bindings, edge caching).
- **Negative / Risks:** Development/test differences exist between Node runtime and Cloudflare Workers runtime; Workers bindings (e.g. KV, AI) are absent or stubbed in the Render Node environment (`src/env/cloudflare-workers.node.ts`).
- **Adoption Readiness:** Already active in production (`wrangler.jsonc`, `src/cloudflare-worker.ts`).

## Directives for AI Agents

- **Do:** Treat Cloudflare Workers as the sole production environment target (`wrangler.jsonc`, `src/cloudflare-worker.ts`).
- **Do:** Keep the Render Node build path purely for agent isolated debugging and testing when `RENDER=true`.
- **Don't:** Modify `wrangler.jsonc` or Worker routing logic to support Node runtime assumptions.
- **Don't:** Treat Render or Node standalone server builds as failover or production environments.
