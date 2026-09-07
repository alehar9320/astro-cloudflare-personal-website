# 0001. Cloudflare Workers as Production, Render as Jules Test Environment

- **Status:** Accepted
- **Date:** 2026-08-24
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

The personal portfolio site supports two build paths: Cloudflare Workers (static SSG/SSR via `@astrojs/cloudflare`) and a standalone Node.js server (`@astrojs/node`) triggered when `RENDER=true`. Production runs on Cloudflare Workers (https://me.alehar.workers.dev/). A clear operational separation is required so AI agents (such as Google Jules) can run integration and health checks against a Node environment without treating Render as a production failover or active secondary deployment.

## Decision

Cloudflare Workers is strictly designated as the sole Production target. Render is strictly an isolated testing and preview environment for AI agent verification (`render.yaml`). Render is neither a production failover nor a secondary hosting target.

## Consequences & Tradeoffs

- **Positive:** Eliminates operational confusion regarding dual deployment targets; guarantees Cloudflare Edge environment bindings (`wrangler.jsonc`, KV, AI) remain production authoritative.
- **Negative / Risks:** Node standalone compatibility stubs (`src/env/cloudflare-workers.node.ts`) must be maintained to ensure agent verification passes on Render without Workers native bindings.
- **Adoption Readiness:** Already implemented across `astro.config.mjs`, `render.yaml`, and `wrangler.jsonc`.

## Directives for AI Agents

- **Do:** Ensure production deployment features and Worker bindings target `@astrojs/cloudflare` and `wrangler.jsonc`.
- **Do:** Keep Render node mocks/stubs in `src/env/cloudflare-workers.node.ts` updated if Worker binding contracts change.
- **Don't:** Modify production routing or architectural assumptions to treat Render as a secondary production environment.
- **Don't:** Remove the `isRender` branching in `astro.config.mjs`.
