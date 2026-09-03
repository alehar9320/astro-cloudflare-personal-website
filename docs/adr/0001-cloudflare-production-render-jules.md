# 0001. Cloudflare Workers as Production, Render as Jules Test Environment

- **Status:** Accepted
- **Date:** 2026-08-24
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

The repository supports two build configurations: Cloudflare Workers (static site with `@astrojs/cloudflare`) and a Node standalone server when `RENDER=true` (`@astrojs/node`). Production is hosted at https://me.alehar.workers.dev/. A clear operational boundary is required so AI agents (such as Google Jules) and human developers do not treat the Node path as a secondary production deployment or failover mechanism.

## Decision

Production is strictly Cloudflare Workers (`wrangler.jsonc`, `src/cloudflare-worker.ts`). Render is designated exclusively as a test environment for Google Jules debugging (Node server via `render.yaml`). Render is not a secondary production host or failover.

## Consequences & Tradeoffs

- **Positive:** Clear architectural boundaries eliminate ambiguity regarding production target runtime, bindings, and caching strategies.
- **Negative / Risks:** Cloudflare-specific bindings (e.g., KV, Workers AI) are absent or stubbed in the Render Node environment (`src/env/cloudflare-workers.node.ts`).
- **Adoption Readiness:** Currently active in production.

## Directives for AI Agents

- **Do:**
  - Route production build and runtime target logic exclusively to Cloudflare Workers + Assets (`wrangler.jsonc`, `src/cloudflare-worker.ts`).
  - Use the Render Node standalone server path strictly for Jules AI debugging and test environments (`render.yaml`).
- **Don't:**
  - Do NOT treat Render as a production failover or secondary deployment target.
  - Do NOT introduce production Cloudflare Worker binding dependencies directly into the Render Node build without providing fallback stubs in `src/env/cloudflare-workers.node.ts`.
