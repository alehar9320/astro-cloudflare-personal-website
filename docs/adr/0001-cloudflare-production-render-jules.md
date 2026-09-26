# 0001. Cloudflare as Production, Render as Jules Test Environment

- **Status:** Accepted
- **Date:** 2026-08-24
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

The repository site can be built and deployed in two runtime modes:

1. **Cloudflare Workers:** Static SSG + `@astrojs/cloudflare` runtime adapter.
2. **Node Standalone Server:** Server-rendered Node application when `RENDER=true` via `@astrojs/node`.

Production is hosted live at `https://me.alehar.workers.dev/`. To enable automated AI agent debugging (e.g. Google Jules sandbox testing), a secondary Node deployment exists on Render (`render.yaml`). A clear, unambiguous boundary is required to prevent AI agents or build scripts from treating the Render Node path as a secondary production target or automatic failover.

## Decision

Production is strictly **Cloudflare Workers**. The Render environment is solely a test environment for Google Jules debugging (`RENDER=true` with `@astrojs/node` adapter). It is NOT a second production environment and NOT an automated failover.

## Consequences & Tradeoffs

- **Positive:** Clear architectural separation between production edge infrastructure and agent test runners.
- **Negative / Risks:** Development environments must simulate Cloudflare Worker bindings (such as Workers KV or AI bindings) using stubs (`src/env/cloudflare-workers.node.ts`) when executing under Node.
- **Adoption Readiness:** Already live in production and actively utilized by CI and Jules sandbox testing.

## Directives for AI Agents

- **Do:**
  - Target production changes and edge runtime utilities strictly to `@astrojs/cloudflare` and Cloudflare Worker APIs (`wrangler.jsonc`, `src/cloudflare-worker.ts`).
  - Maintain environment mock stubs in `src/env/cloudflare-workers.node.ts` whenever introducing new Cloudflare Workers bindings so that Render tests pass cleanly.
- **Don't:**
  - Do NOT add production failover logic or fallback routing to Render in production workers.
  - Do NOT rely on Node.js native standard libraries in production edge runtime code unless compatible with Cloudflare Workers workerd runtime.
