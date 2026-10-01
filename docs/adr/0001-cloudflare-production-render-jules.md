# 0001. Cloudflare as Production Runtime, Render as Jules Test Environment

- **Status:** Accepted
- **Date:** 2026-08-24
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

The site can build two ways: Cloudflare Workers (static + `@astrojs/cloudflare`) or a Node standalone server when `RENDER=true` (`@astrojs/node`). Production already runs on Cloudflare Workers (`https://me.alehar.workers.dev/`). We need a clear architectural split so AI test environments (e.g., Google Jules) can run and debug against a Node environment without treating that secondary path as a production target or failover server.

## Decision

Production is strictly Cloudflare Workers + Assets (`wrangler.jsonc`, `src/cloudflare-worker.ts`). Render is an isolated test environment for Google Jules (Node server via `render.yaml`). It is NOT a second production environment and NOT a failover target.

## Consequences & Tradeoffs

- **Positive:** Clear, unambiguous primary deployment runtime target. Prevents configuration drift and dual-deployment complexity.
- **Negative / Risks:** Node test server in Render lacks native Workers bindings (KV, AI, Edge Cache). These must be stubbed or fall back gracefully in `src/env/cloudflare-workers.node.ts`.
- **Adoption Readiness:** Production is active on Cloudflare Workers; Render test path is configured in `render.yaml`.

## Directives for AI Agents

- **Do:** Target all production features, headers, and edge performance optimizations to the Cloudflare Workers execution model.
- **Don't:** Introduce features or routing logic that depend on standalone Node server behavior for production deployments.
