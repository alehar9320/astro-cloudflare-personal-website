# 0001. Cloudflare as Production, Render as Jules Test Environment

- **Status:** Accepted
- **Date:** 2026-08-24
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

The repository supports dual-target builds: Cloudflare Workers (using `@astrojs/cloudflare` and static pre-rendering) and Node standalone server mode when `RENDER=true` (using `@astrojs/node`). Production is hosted on Cloudflare Workers (`https://me.alehar.workers.dev/`). We require a explicit distinction between the production runtime and the Node test environment used by AI agent tooling (such as Google Jules) to prevent mistaking the Node path for a secondary production target or failover system.

## Decision

Cloudflare Workers is the sole production runtime environment. The Render deployment (`render.yaml` with `@astrojs/node`) is strictly a headless test environment for Google Jules and automated agent validation. It is not a secondary production cluster, nor a hot failover target.

## Consequences & Tradeoffs

- **Positive:** Eliminates ambiguity across deployment targets and operational language; guarantees Cloudflare Workers edge runtime features (KV, Workers AI, ASSETS binding) remain primary.
- **Negative / Risks:** The Node test environment requires mocking or fallback stubs (`src/env/cloudflare-workers.node.ts`) for Workers bindings (e.g. KV namespaces, AI bindings).
- **Adoption Readiness:** Already in active operation across production and test environments.

## Directives for AI Agents

- **Do:** Treat Cloudflare Workers (`wrangler.jsonc`, `@astrojs/cloudflare`) as the sole production target.
- **Do:** Use `src/env/cloudflare-workers.node.ts` for Node fallback bindings when running under `RENDER=true`.
- **Don't:** Refer to Render or Node standalone builds as production, secondary production, or failover environments in documentation, comments, or operational code.
