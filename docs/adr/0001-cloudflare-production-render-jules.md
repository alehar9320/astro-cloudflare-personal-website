# 0001. Cloudflare as Production Runtime, Render as Jules Test Environment

- **Status:** Accepted
- **Date:** 2026-08-24
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

The site can build two ways: Cloudflare Workers (static + `@astrojs/cloudflare`) or a Node standalone server when `RENDER=true` (`@astrojs/node`). Prod already runs on Cloudflare Workers. We need a clear boundary so Google Jules and automated test runners can debug against a Node environment without treating that path as a second production or failover target.

## Decision

Production deployment is Cloudflare Workers only (`wrangler.jsonc`, `src/cloudflare-worker.ts`). Render is strictly a test environment for Google Jules debugging (`render.yaml`). It is not a second production or failover target.

## Consequences & Tradeoffs

- **Positive:** Clear deployment target isolation; single source of truth for edge runtime behaviors and Cloudflare Worker bindings.
- **Negative / Risks:** Render test environment lacks live Cloudflare KV/AI bindings, requiring explicit stubs in `src/env/cloudflare-workers.node.ts`.
- **Adoption Readiness:** Currently active in production and CI/CD pipelines.

## Directives for AI Agents

- **Do:** Target production builds and Cloudflare Workers runtime APIs for all live features and routing.
- **Do:** Use stubbed Node compatibility hooks in `src/env/cloudflare-workers.node.ts` when running in non-Workers test runtimes.
- **Don't:** Do not treat Render as a production failover target or attempt to deploy dual-production architectures.
