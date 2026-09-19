# 0001. Cloudflare Workers Production Architecture with Node.js Render Test Sandbox

- **Status:** Accepted
- **Date:** 2026-08-24
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

The repository supports dual build modes: Cloudflare Workers (static SSG + `@astrojs/cloudflare` SSR) and a Node standalone server (`@astrojs/node`) enabled when `RENDER=true`. Production runs on Cloudflare Workers (`https://me.alehar.workers.dev/`). A clear architectural separation is required so AI developer agents (such as Google Jules) can test and debug in a Node environment without misinterpreting the Node target as a secondary production environment, failover, or multi-cloud deployment.

## Decision

Production is strictly deployed on **Cloudflare Workers**. The Render Node web service (`render.yaml`) is designated exclusively as a **testing and debugging environment** for Google Jules and automated agent execution. It is not a secondary production cluster and must not be treated as a failover route.

## Consequences & Tradeoffs

- **Positive:**
  - Clear architectural boundaries eliminate ambiguity for human developers and AI agents.
  - Ensures Cloudflare Workers edge bindings (`wrangler.jsonc`, `src/cloudflare-worker.ts`) remain the single source of production runtime truth.
  - Allows isolated local/agent Node debugging without polluting production edge environment configurations.
- **Negative / Risks:**
  - Workers-specific bindings (e.g., KV, AI, HTMLRewriter) are absent or mocked in the Node standalone test environment (`src/env/cloudflare-workers.node.ts`).
  - Dual-adapter Astro configuration (`astro.config.mjs`) must maintain branching logic (`isRender`).
- **Adoption Readiness:** Already active and production-proven across Cloudflare and Render setups.

## Directives for AI Agents

- **Do:**
  - Treat Cloudflare Workers (`@astrojs/cloudflare`) as the sole production target.
  - Use the Node adapter path (`RENDER=true`) strictly for agent debugging, isolated smoke tests, or local Node preview testing.
  - Keep `src/env/cloudflare-workers.node.ts` up to date with proper mocks whenever new Cloudflare Workers bindings are added.
- **Don't:**
  - **NEVER** modify `wrangler.jsonc` or Cloudflare deployment configs to route production traffic to Render.
  - **NEVER** assume Workers bindings (KV, AI) are natively present when running under `RENDER=true`.
  - **NEVER** treat Render as a production failover or multi-cloud target in architecture documentation or operational scripts.
