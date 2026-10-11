# 0001. Cloudflare as Production, Render as Jules Test Env

- **Status:** Accepted
- **Date:** 2026-08-24
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

The site can build two ways: Cloudflare Workers (static + `@astrojs/cloudflare`) or a Node standalone server when `RENDER=true` (`@astrojs/node`). Prod already runs at https://me.alehar.workers.dev/. We need a clear split so Google Jules can debug against a Node environment without treating that path as a second production or failover.

## Decision

Production is Cloudflare Workers only. Render is a test environment for Google Jules (Node server via `render.yaml`). It is not a second prod and not a failover.

## Consequences & Tradeoffs

- **Positive:** Clear deployment boundary, simplified production operations on Cloudflare edge, and isolated Node runtime for automated AI testing.
- **Negative / Risks:** Cloudflare-specific Workers bindings (AI, KV, Assets) are unavailable or stubbed when running on Render Node server (`src/env/cloudflare-workers.node.ts`).
- **Adoption Readiness:** Established baseline architecture.

## Directives for AI Agents

- **Do:** Ship and operate production strictly on Cloudflare Workers (`wrangler.jsonc`, `src/cloudflare-worker.ts`).
- **Do:** Keep the Render Node path (`RENDER=true`) isolated for Jules debugging only.
- **Don't:** Treat Render as a second production deployment target, backup, or failover.
- **Don't:** Expose Cloudflare Workers secrets or bindings in client-side code when adding Render test mocks.
