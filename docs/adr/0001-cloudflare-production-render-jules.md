# 0001. Cloudflare Workers as Production, Render Node Server as Jules Test Environment

- **Status:** Accepted
- **Date:** 2026-08-24
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

The site supports two build paths: Cloudflare Workers (static pre-rendering with `@astrojs/cloudflare`) and Node standalone server when `RENDER=true` (`@astrojs/node`). Production is hosted at https://me.alehar.workers.dev/. A clear operational boundary is required so AI agents (such as Google Jules) can run integration and debugging checks against a Node environment without treating the Node build path as a second production instance or failover target.

## Decision

Production deployment is strictly dedicated to Cloudflare Workers (`wrangler.jsonc`, `src/cloudflare-worker.ts`). Render is designated exclusively as a test and debugging environment for Google Jules (Node server via `render.yaml`). Render is NOT a second production environment and MUST NOT be used as a production failover.

## Consequences & Tradeoffs

- **Positive:** Clear architectural isolation eliminates deployment ambiguity for both human developers and autonomous AI agents.
- **Negative / Risks:** Development and testing on Render requires stubbing Cloudflare Workers bindings (such as AI, KV, and Assets bindings via `src/env/cloudflare-workers.node.ts`).
- **Adoption Readiness:** Already active and implemented across `wrangler.jsonc`, `render.yaml`, and environment configuration.

## Directives for AI Agents

- **Do:** Treat Cloudflare Workers as the sole production target and Render as a test/debugging runtime for Jules.
- **Do:** Expect Workers bindings (AI, KV) to be absent or stubbed when running under `RENDER=true` in Node environments.
- **Don't:** Configure Render as a failover or secondary production deployment target.
- **Don't:** Remove or bypass `src/env/cloudflare-workers.node.ts` compatibility fallbacks when running in Node.
