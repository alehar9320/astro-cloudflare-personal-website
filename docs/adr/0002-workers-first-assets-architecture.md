# 0002. Workers-First Static Assets Architecture

- **Status:** Accepted
- **Date:** 2026-03-30
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

Cloudflare Pages legacy deployments and traditional worker proxying patterns have evolved towards Cloudflare Workers + Assets (Unified Workers-First architecture). In this repository, Astro builds static output to `./dist`, while Cloudflare Worker bindings (`CHAT_STORE` KV, `AI` Workers AI, and environment variables) are bound directly to the custom worker entrypoint at `src/cloudflare-worker.ts`.

Without an explicit architectural record, AI agents and developers might attempt to revert to legacy `@cloudflare/kv-asset-handler` packages or legacy Cloudflare Pages configurations in `wrangler.jsonc`, leading to broken deployment pipelines or missing runtime bindings.

## Decision

We adopt Cloudflare Workers + Assets as the single unified architecture for production deployments.

1. Static assets built by Astro (`output: "static"`) are served directly via the `assets` config in `wrangler.jsonc` (`binding: "ASSETS"`, `directory: "./dist"`).
2. `src/cloudflare-worker.ts` serves as the primary Cloudflare Worker entrypoint (`main` in `wrangler.jsonc`), handling dynamic routes (such as `/api/chat`, `/api/visits`, and `/api/releases`) and custom 404 handling (`run_worker_first: ["/404", "/404/"]`).
3. Workers KV (`CHAT_STORE`) and Workers AI (`AI`) bindings are bound natively in `wrangler.jsonc` and accessed in Astro API routes via `context.locals.runtime.env`.

## Consequences & Tradeoffs

- **Positive:**
  - Eliminates external asset proxy overhead and legacy Workers KV asset storage costs.
  - Direct access to Cloudflare Workers runtime bindings (`AI`, `CHAT_STORE` KV) within dynamic Astro API handlers.
  - Zero-downtime static asset deployments backed by Cloudflare's edge network.
- **Negative / Risks:**
  - Local Node server debugging (e.g., Render test env) requires stubbing Workers bindings (`src/env/cloudflare-workers.node.ts`).
  - Changes to `wrangler.jsonc` configuration must align strictly with Workers + Assets syntax rather than legacy Cloudflare Pages project formats.
- **Adoption Readiness:** High. Fully operational in active production setup and validated by build and test pipelines.

## Directives for AI Agents

- **Do:**
  - Preserve `assets` binding (`binding: "ASSETS"`, `directory: "./dist"`) in `wrangler.jsonc`.
  - Access runtime bindings (`env.CHAT_STORE`, `env.AI`) through Astro runtime context or `cloudflare:workers` stubs.
  - Define all production environment variables and Workers bindings inside `wrangler.jsonc`.
- **Don't:**
  - Do NOT add or re-introduce `@cloudflare/kv-asset-handler` or legacy Cloudflare Pages deployment manifests.
  - Do NOT modify `main: "./src/cloudflare-worker.ts"` without verifying custom Worker routing behavior.
  - Do NOT remove `run_worker_first` configuration required for dynamic fallback and custom 404 handling.
