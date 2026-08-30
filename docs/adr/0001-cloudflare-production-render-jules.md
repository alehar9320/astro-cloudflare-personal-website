# 0001. Cloudflare as Production and Render as Jules Test Environment

- **Status:** Accepted
- **Date:** 2026-08-24
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

The application supports dual build modes: Cloudflare Workers (static output with `@astrojs/cloudflare`) and a standalone Node server when `RENDER=true` (`@astrojs/node`). Production is hosted at `https://me.alehar.workers.dev/`. A distinct separation is required so that automated agents (such as Google Jules) can run and test against a Node environment without misinterpreting the Node target as a secondary production environment or failover deployment.

## Decision

Production target is strictly Cloudflare Workers + Assets (`wrangler.jsonc`, `src/cloudflare-worker.ts`). Render is designated exclusively as an isolated test and debugging environment for Google Jules (`render.yaml`). Render is explicitly not a production failover or redundant production host.

## Consequences & Tradeoffs

- **Positive:** Guarantees production architecture remains unified under Cloudflare Workers while maintaining testability in Node-based sandbox/agent environments.
- **Negative / Risks:** Cloudflare-native bindings (AI, KV stores) are absent or stubbed in the Render Node environment (`src/env/cloudflare-workers.node.ts`).
- **Adoption Readiness:** Already fully implemented and active in repository build workflows.

## Directives for AI Agents

- **Do:** Ship, operate, and target production exclusively via Cloudflare Workers + Assets (`wrangler.jsonc`).
- **Do:** Keep Render deployment configuration strictly scoped to Jules testing and Node debugging.
- **Don't:** Treat Render or `@astrojs/node` output as a secondary production host or failover deployment.
- **Don't:** Modify production deployment automation to depend on Node runtime infrastructure.
