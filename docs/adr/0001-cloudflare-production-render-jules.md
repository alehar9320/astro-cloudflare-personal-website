# 0001. Cloudflare as Production, Render as Jules Test Environment

- **Status:** Accepted
- **Date:** 2026-08-24
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

The site can build two ways: Cloudflare Workers (static + `@astrojs/cloudflare`) or a Node standalone server when `RENDER=true` (`@astrojs/node`). Production runs on Cloudflare Workers (`https://me.alehar.workers.dev/`). A clear separation is required so test agents (such as Google Jules) can run and debug against a Node server without treating that environment as a secondary production environment or failover target.

## Decision

Production is strictly Cloudflare Workers. Render is designated exclusively as a test environment for Google Jules (Node server via `render.yaml`). It is neither a secondary production host nor a failover target.

## Consequences & Tradeoffs

- **Positive:** Clear, unambiguous deployment boundaries between production and test runtime environments.
- **Negative / Risks:** Expect Cloudflare Worker bindings (Workers AI, Cloudflare KV) to be absent or stubbed in the Render Node environment (`src/env/cloudflare-workers.node.ts`).
- **Adoption Readiness:** Fully active and operational in `astro.config.mjs` and `render.yaml`.

## Directives for AI Agents

- **Do:** Treat Cloudflare Workers as the sole production target for code changes and deployment logic.
- **Do:** Support the Render Node server path solely for Jules test and debug workflows (`RENDER=true`).
- **Don't:** Add production failover logic or secondary deployment pipelines pointing to Render.
- **Don't:** Expect native Cloudflare bindings to be available directly in the Render Node test runner without stubbing.
