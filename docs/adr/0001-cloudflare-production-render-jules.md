# 0001. Cloudflare as Production, Render as Jules Test Environment

- **Status:** Accepted
- **Date:** 2026-08-24
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

The site can build two ways: Cloudflare Workers (static + `@astrojs/cloudflare`) or a Node standalone server when `RENDER=true` (`@astrojs/node`). Production runs on Cloudflare Workers. We need a clear boundary so test environments and autonomous agents can run against a Node standalone build without treating that path as a second production deployment or failover environment.

## Decision

Production deployment is strictly on Cloudflare Workers (`@astrojs/cloudflare`). Render is reserved as a test/sandbox environment for agent verification and Node-based server testing (`render.yaml`). It is neither a secondary production target nor a failover deployment.

## Consequences & Tradeoffs

- **Positive:** Prevents split-brain production deployments and simplifies edge runtime assumptions for production features.
- **Negative / Risks:** Developers and test agents must maintain mock stubs (`src/env/cloudflare-workers.node.ts`) when running outside of Cloudflare Workers execution contexts where KV or Workers AI bindings are unavailable.
- **Adoption Readiness:** Already fully implemented in deployment workflows (`wrangler.jsonc`, `render.yaml`).

## Directives for AI Agents

- **Do:** Treat Cloudflare Workers (`@astrojs/cloudflare`) as the single source of truth for production configuration and deployment.
- **Don't:** Modify `wrangler.jsonc` or routing logic to treat Render or Node standalone builds as production environments.
