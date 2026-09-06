# 0001. Cloudflare as Production, Render as Jules Test Environment

- **Status:** Accepted
- **Date:** 2026-08-24
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

The site can build in two ways: Cloudflare Workers (static + `@astrojs/cloudflare`) or a Node standalone server when `RENDER=true` (`@astrojs/node`). Production runs at https://me.alehar.workers.dev/. A clear operational split is needed so test and simulation runtime environments (e.g. Render Node server) do not conflict with primary edge deployment targets or cause confusion during AI agent development and automated testing.

## Decision

Production target is strictly Cloudflare Workers. The Render Node path is exclusively a test/debug environment for automated workflows (via `render.yaml`). It is neither a second production environment nor a failover deployment target.

## Consequences & Tradeoffs

- **Positive:** Clear deployment boundaries; optimizes edge features (Cloudflare Workers KV, AI bindings) without maintaining multi-cloud production parity.
- **Negative / Risks:** Node test runtime requires mock/stubbed implementations (`src/env/cloudflare-workers.node.ts`) for Workers-specific APIs.
- **Adoption Readiness:** Already established and actively deployed in repository configuration (`wrangler.jsonc`, `src/cloudflare-worker.ts`).

## Directives for AI Agents

- **Do:**
  - Target Cloudflare Workers (`wrangler.jsonc` and `@astrojs/cloudflare`) for all production builds, deployments, and edge architecture decisions.
  - Treat Render configuration (`render.yaml`) purely as a Node test runner harness.
- **Don't:**
  - Do not introduce failover routing or production deployment logic targeting Node / Render.
  - Do not alter `wrangler.jsonc` or Cloudflare Worker deployment targets without explicit architectural decision review.
