# 0001. Cloudflare as Production, Render as Jules Test Environment

- **Status:** Accepted
- **Date:** 2026-08-24
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

The website can build targeting two different runtime targets: Cloudflare Workers (static + `@astrojs/cloudflare`) or a Node standalone server when `RENDER=true` (`@astrojs/node`). Production is deployed at https://me.alehar.workers.dev/. A clear operational boundary is required so AI agents (e.g., Google Jules) can test and debug against a Node server without misinterpreting Render as a second production or failover target.

## Decision

Production is strictly Cloudflare Workers. Render is designated exclusively as a test environment for Google Jules debugging (running the Node standalone build via `render.yaml`). Render is neither a secondary production host nor a failover target.

## Consequences & Tradeoffs

- **Positive:**
  - Prevents split-brain deployment confusion between Cloudflare and Render environments.
  - Keeps production focused on edge performance via Cloudflare Workers + Assets.
- **Negative / Risks:**
  - Node test environment lacks native Workers KV/AI bindings, requiring node stubs (`src/env/cloudflare-workers.node.ts`).
- **Adoption Readiness:** Already implemented and operational across `wrangler.jsonc`, `astro.config.mjs`, and `render.yaml`.

## Directives for AI Agents

- **Do:**
  - Target production deployment logic exclusively to Cloudflare Workers (`wrangler.jsonc`, `src/cloudflare-worker.ts`).
  - Use `RENDER=true` when configuring or debugging Node standalone test environments.
- **Don't:**
  - Treat Render configurations as production or failover deployments.
  - Introduce production code dependencies on Node standalone runtime features.
