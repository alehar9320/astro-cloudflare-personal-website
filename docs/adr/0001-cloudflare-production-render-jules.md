# 0001. Cloudflare as Production, Render as Jules Test Environment

- **Status:** Accepted
- **Date:** 2026-08-24
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

The site can build in two ways: Cloudflare Workers (static + `@astrojs/cloudflare`) or a Node standalone server when `RENDER=true` (`@astrojs/node`). Production is deployed at https://me.alehar.workers.dev/. A clear operational boundary is required so AI agents (e.g., Google Jules) can run and test against a Node environment without treating that environment as a secondary production target or failover cluster.

## Decision

Production hosting is strictly Cloudflare Workers + Assets (`wrangler.jsonc`). Render is designated exclusively as a test environment for Google Jules running a Node standalone server (`render.yaml`). Render is not a secondary production host or a failover site.

## Consequences & Tradeoffs

- **Positive:** Eliminates deployment ambiguity, maintains Workers-First performance on Cloudflare, and provides a sandbox for Node runtime testing.
- **Negative / Risks:** Expect Workers bindings (e.g., KV, AI) to be absent or stubbed in the Render Node fallback environment (`src/env/cloudflare-workers.node.ts`).
- **Adoption Readiness:** Already implemented and operational in build scripts (`astro.config.mjs`) and deployment blueprints (`render.yaml`).

## Directives for AI Agents

- **Do:** Direct all production configuration, edge bindings, and release workflows exclusively toward Cloudflare Workers + Assets (`wrangler.jsonc`).
- **Do:** Use `src/env/cloudflare-workers.node.ts` to stub Workers bindings when testing in Node runtime environments.
- **Don't:** Do not treat Render as a secondary production site or introduce dual-deploy production pipelines.
- **Don't:** Do not modify `wrangler.jsonc` or `render.yaml` deployment configs without explicit architecture review.
