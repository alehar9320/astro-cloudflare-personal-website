# 0001. Cloudflare as Production Environment, Render as Jules Test Environment

- **Status:** Accepted
- **Date:** 2026-08-24
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

The application is capable of building in two distinct operational modes: Cloudflare Workers (static SSG + edge SSR runtime via `@astrojs/cloudflare`) or a Node standalone server when `RENDER=true` (`@astrojs/node`). Production is deployed to Cloudflare Workers (`me.alehar.workers.dev`). A clear architectural boundary is required so AI agents (e.g., Google Jules) do not treat the Render Node environment as a secondary production environment, active failover, or multi-cloud deployment target.

## Decision

Cloudflare Workers is the sole production runtime environment. Render is dedicated strictly as a secondary test environment for Google Jules automated debugging (via `render.yaml` and `@astrojs/node`). Render is not a secondary production cluster or failover mechanism.

## Consequences & Tradeoffs

- **Positive:**
  - Clear operational simplicity: production monitoring, edge caching, KV storage, and Workers AI bindings are centered exclusively on Cloudflare Workers.
  - Predictable agent execution context for Jules debugging sessions.
- **Negative / Risks:**
  - Node standalone test environment on Render requires stubbing or mocking Cloudflare Worker bindings (such as Workers AI / KV) via `src/env/cloudflare-workers.node.ts`.
- **Adoption Readiness:**
  - Fully implemented across build pipeline scripts, wrangler config (`wrangler.jsonc`), and environment abstractions (`src/env/`).

## Directives for AI Agents

- **Do:**
  - Ship production configurations, bindings, and edge deployments targetting Cloudflare Workers (`wrangler.jsonc`, `src/cloudflare-worker.ts`).
  - Expect Cloudflare Workers KV and AI bindings to be unavailable or stubbed when executing under Node server environments (`RENDER=true`).
- **Don't:**
  - NEVER treat Render as a secondary production target, failover route, or active multi-cloud load balancer.
  - NEVER introduce Cloudflare Worker-specific global APIs into shared application routes without fallback abstractions in `src/env/`.
