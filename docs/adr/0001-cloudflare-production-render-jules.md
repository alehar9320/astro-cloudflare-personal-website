# 0001. Cloudflare as Production, Render as Jules Test Environment

- **Status:** Accepted
- **Date:** 2026-08-24
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

The site can build and render through two distinct adapters:

1. Cloudflare Workers (static + `@astrojs/cloudflare`).
2. Node standalone server when `RENDER=true` (`@astrojs/node`).

Production is served live at `https://me.alehar.workers.dev/`. We need a clear environment boundary so AI agents (such as Google Jules) can test and debug against a Node environment without treating the Node build target as a secondary production or failover cluster.

## Decision

Production is strictly Cloudflare Workers (`wrangler.jsonc`, `src/cloudflare-worker.ts`).

Render serves exclusively as a sandbox test environment for Google Jules (Node server via `render.yaml`). Render is NOT a secondary production server and MUST NOT be used for production traffic or failover routing.

## Consequences & Tradeoffs

- **Positive:**
  - Clear architectural separation between production edge infrastructure and agent test sandboxes.
  - Eliminates configuration drift risks between Node.js and Cloudflare Workers runtime expectations.

- **Negative / Risks:**
  - Workers-specific bindings (e.g., Cloudflare KV, AI bindings) must be stubbed or polyfilled in the Node test environment (`src/env/cloudflare-workers.node.ts`).

- **Adoption Readiness:**
  - Active and established production baseline.

## Directives for AI Agents

- **Do:**
  - Treat Cloudflare Workers as the sole production target when updating deployment configs, cache strategies, or worker entrypoints.
  - Polyfill or stub Cloudflare Worker bindings in `src/env/cloudflare-workers.node.ts` when introducing new Workers features so the Node test server remains functional for testing.
- **Don't:**
  - Do NOT add production failover logic, DNS fallbacks, or traffic routing to Render.
  - Do NOT treat Node server adapter behavior as production behavior when diagnosing Cloudflare edge runtime issues.
