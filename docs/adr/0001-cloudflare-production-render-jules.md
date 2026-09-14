# 0001. Cloudflare as Production, Render as Jules Test Env

- **Status:** Accepted
- **Date:** 2026-08-24
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

The site can build two ways: Cloudflare Workers (static + `@astrojs/cloudflare`) or a Node standalone server when `RENDER=true` (`@astrojs/node`). Production already runs on Cloudflare Workers. We need a clear boundary so Google Jules can debug against a Node environment without treating that path as a second production or failover.

## Decision

Production is Cloudflare Workers only. Render is strictly a test environment for Google Jules (Node server via `render.yaml`). It is not a second production environment and not a failover target.

## Consequences & Tradeoffs

- **Positive:** Clear architectural boundary, single source of truth for production deployments, optimized Cloudflare Workers edge delivery.
- **Negative / Risks:** Node standalone server behavior on Render may subtly differ from Cloudflare Workers edge environment (e.g., absence of native KV or Workers AI bindings on Render requiring stubs).
- **Adoption Readiness:** Fully active in production and CI configuration.

## Directives for AI Agents

- **Do:** Ship and operate production strictly on Cloudflare Workers (`wrangler.jsonc`, `src/cloudflare-worker.ts`).
- **Do:** Keep the Render Node path (`src/env/cloudflare-workers.node.ts`) isolated for Jules test execution.
- **Don't:** Refer to Render as a secondary production or failover target in documentation, PRs, or configuration.
- **Don't:** Expect native Cloudflare Workers KV or AI bindings to be available in the Render Node test environment without fallback stubs.
