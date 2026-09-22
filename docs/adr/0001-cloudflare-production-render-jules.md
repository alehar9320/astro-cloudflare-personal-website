# 0001. Cloudflare as Production, Render as Jules Test Environment

- **Status:** Accepted
- **Date:** 2026-08-24
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

The site supports two build paths: Cloudflare Workers (static + `@astrojs/cloudflare`) and a Node standalone server when `RENDER=true` (`@astrojs/node`). Production is deployed at https://me.alehar.workers.dev/. A clear operational boundary is required so AI agents (such as Google Jules) can debug and execute tests against a Node runtime environment without treating the Node build as a parallel production environment or failover target.

## Decision

Production target is strictly Cloudflare Workers. Render is designated exclusively as a test environment for AI agent debugging (`render.yaml` Node server). Render is not a secondary production host or failover service.

## Consequences & Tradeoffs

- **Positive:** Clear deployment target eliminates ambiguity around environment bindings and runtime behaviors.
- **Negative / Risks:** Developers and AI agents must account for differences between Cloudflare Worker bindings (KV/AI) and Node runtime stubs (`src/env/cloudflare-workers.node.ts`).
- **Adoption Readiness:** Currently active and verified across production Cloudflare Workers and Render test deployments.

## Directives for AI Agents

- **Do:** Target Cloudflare Workers (`wrangler.jsonc`, `src/cloudflare-worker.ts`) as the primary production runtime for all deployment, routing, and header logic.
- **Do:** Treat Render (`RENDER=true`, `@astrojs/node`) solely as an auxiliary Node testing environment.
- **Don't:** Modify production Cloudflare routing or Worker logic to suit Node server assumptions.
- **Don't:** Refer to Render or Node standalone builds as production or failover in documentation or deployment scripts.
