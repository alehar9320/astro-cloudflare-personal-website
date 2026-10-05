# 0001. Cloudflare as Production, Render as Jules Test Environment

- **Status:** Accepted
- **Date:** 2026-08-24
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

The personal portfolio site supports two build paths: Cloudflare Workers (static assets + `@astrojs/cloudflare`) and a Node standalone server when `RENDER=true` (`@astrojs/node`). Production already runs on Cloudflare Workers. We need a clear structural boundary so AI agents and human contributors recognize Cloudflare Workers as the single production runtime, avoiding confusion regarding secondary production paths or failovers.

## Decision

Production deployment is Cloudflare Workers only. Render is strictly designated as a test environment for Google Jules debugging (Node server via `render.yaml`). Render is NOT a secondary production environment and NOT a failover target.

## Consequences & Tradeoffs

- **Positive:** Eliminates architectural ambiguity regarding deployment targets. Ensures edge-first optimization and Cloudflare Workers bindings (KV, Assets) remain canonical.
- **Negative / Risks:** Node path on Render requires stubbing or simulating Cloudflare Workers bindings (`src/env/cloudflare-workers.node.ts`).
- **Adoption Readiness:** Fully operational and validated in production.

## Directives for AI Agents

- **Do:** Treat Cloudflare Workers + Assets (`wrangler.jsonc`, `src/cloudflare-worker.ts`) as the sole production target. Keep Node/Render logic isolated strictly to testing/debugging contexts.
- **Don't:** Modify `wrangler.jsonc` to introduce Cloudflare Pages or alternative runtime targets; do not treat Render or Node builds as a secondary production deployment or failover target.
