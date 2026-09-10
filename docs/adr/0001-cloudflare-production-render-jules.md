# 0001. Cloudflare as Production, Render as Jules Test Env

- **Status:** Accepted
- **Date:** 2026-08-24
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

The website can build using two distinct adapters: Cloudflare Workers (`@astrojs/cloudflare`) or a Node standalone server (`@astrojs/node`) when `RENDER=true`. Production runs at `https://me.alehar.workers.dev/`. A clear architectural boundary is required so autonomous agents and human developers do not treat the Node server path on Render as a secondary production environment or failover target.

## Decision

Production deployment is strictly on Cloudflare Workers. Render is maintained exclusively as a secondary Node test and debugging environment for automated agents (e.g., Google Jules via `render.yaml`). It is explicitly not a production failover or multi-cloud deployment.

## Consequences & Tradeoffs

- **Positive:** Eliminates architectural ambiguity regarding deployment targets, primary runtime bindings, and production operational responsibility.
- **Negative / Risks:** Maintains a secondary build pathway (`@astrojs/node`) that requires environment-variable stubs for Cloudflare bindings (`src/env/cloudflare-workers.node.ts`).
- **Adoption Readiness:** Already established in production (`https://me.alehar.workers.dev/`).

## Directives for AI Agents

- **Do:** Ship, test, and validate production features targeting Cloudflare Workers + Assets (`wrangler.jsonc`, `src/cloudflare-worker.ts`).
- **Do:** Label Render explicitly as a test/debugging environment in documentation and operations.
- **Don't:** Treat Render as a production deployment or failover target.
- **Don't:** Assume Cloudflare Workers bindings (KV, Workers AI) are natively available in Node environments without using proper stubs.
