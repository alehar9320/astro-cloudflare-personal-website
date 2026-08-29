# 0001. Cloudflare as Production, Render as Jules Test Environment

- **Status:** Accepted
- **Date:** 2026-08-24
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

The site can build two ways: Cloudflare Workers (static + `@astrojs/cloudflare`) or a Node standalone server when `RENDER=true` (`@astrojs/node`). Production already runs at https://me.alehar.workers.dev/. We need a clear architectural split so automated AI agents (such as Google Jules) can debug against a Node server environment without treating that path as a second production instance or failover target.

## Decision

Production is strictly Cloudflare Workers + Assets. Render is exclusively a isolated test environment for Google Jules debugging (Node server via `render.yaml`). Render is not a second production environment and must never be treated as a failover target.

## Consequences & Tradeoffs

- **Positive:** Clear separation of deployment targets; production operates entirely on serverless edge infrastructure with ultra-low latency and native Cloudflare Workers assets.
- **Negative / Risks:** Development and test environments running on Node (such as Render) must mock or stub Cloudflare Workers runtime bindings (`src/env/cloudflare-workers.node.ts`).
- **Adoption Readiness:** Fully adopted and active in production.

## Directives for AI Agents

- **Do:** Ship and operate production strictly on the Cloudflare Workers target (`wrangler.jsonc`, `src/cloudflare-worker.ts`).
- **Do:** Refer to Cloudflare as "production" and Render as "Jules test environment" across logs, documentation, and PR descriptions.
- **Don't:** Treat Render as a production target, secondary region, or failover system.
- **Don't:** Rely on native Cloudflare Workers bindings (e.g. KV, AI bindings) when running inside the Render Node test environment.
