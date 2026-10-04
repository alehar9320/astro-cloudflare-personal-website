# 0001. Cloudflare as production, Render as Jules test env

- **Status:** Accepted
- **Date:** 2026-08-24
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

The site can build two ways: Cloudflare Workers (static + `@astrojs/cloudflare`) or a Node standalone server when `RENDER=true` (`@astrojs/node`). Prod already runs at https://me.alehar.workers.dev/. We need a clear split so Google Jules can debug against a Node environment without treating that path as a second production or failover.

## Decision

Production is Cloudflare Workers only. Render is a test environment for Google Jules (Node server via `render.yaml`). It is not a second prod and not a failover.

## Consequences & Tradeoffs

- **Positive:**
  - Clear architectural boundary between production runtime (Cloudflare Workers) and developer/agent testing server (Render/Node).
  - Eliminates ambiguity when configuring Cloudflare Workers edge features or KV bindings.
- **Negative / Risks:**
  - Node runtime in Render may lack or stub Cloudflare Worker bindings (`src/env/cloudflare-workers.node.ts`).
- **Adoption Readiness:** Already active and implemented.

## Directives for AI Agents

- **Do:**
  - Target production deployment logic exclusively to Cloudflare Workers (`wrangler.jsonc`, `src/cloudflare-worker.ts`).
  - Keep Render Node environment solely for Jules test environment execution.
- **Don't:**
  - Do not treat Render as a production environment or failover route.
  - Do not introduce Cloudflare Worker-specific bindings directly into production code without fallback handling in the Node environment wrapper (`src/env/cloudflare-workers.node.ts`).
