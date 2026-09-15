# 0001. Cloudflare Workers as Production Environment and Render as Jules Testbed

- **Status:** Accepted
- **Date:** 2026-08-24
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

The site can build using two runtime paths: Cloudflare Workers (static + `@astrojs/cloudflare`) or a Node.js standalone server when `RENDER=true` (`@astrojs/node`). Production runs on Cloudflare Workers (`https://me.alehar.workers.dev/`). A clear architectural split is required so autonomous agents like Google Jules can execute and debug tests in a Node.js environment without treating that secondary path as production or a failover target.

## Decision

Production is strictly Cloudflare Workers with Assets (`wrangler.jsonc`). The Render deployment is designated strictly as a test/debugging environment for autonomous agents (Google Jules) via `render.yaml`. Render is neither a production target nor a failover environment.

## Consequences & Tradeoffs

- **Positive:** Clear operational boundaries prevent accidental deployment of Node-specific artifacts to Cloudflare Workers and simplify Workers-first runtime optimizations.
- **Negative / Risks:** Node testbed requires stubbing Cloudflare Worker bindings (e.g., `src/env/cloudflare-workers.node.ts`).
- **Adoption Readiness:** Fully implemented and active in repository build pipelines (`astro.config.mjs`, `wrangler.jsonc`, `render.yaml`).

## Directives for AI Agents

- **Do:** Assume Cloudflare Workers + Assets (`wrangler.jsonc`) is the sole production runtime.
- **Do:** Keep `@astrojs/node` build logic isolated behind `process.env.RENDER === 'true'`.
- **Don't:** Add production features or cloud bindings that rely on Node.js runtime globals or server-side Node packages in production code paths.
- **Don't:** Treat Render as a production environment or failover target in documentation, CI, or deployment logic.
