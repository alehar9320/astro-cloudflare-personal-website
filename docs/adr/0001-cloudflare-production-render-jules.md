# 0001. Cloudflare Workers Production & Render Jules Test Environment

- **Status:** Accepted
- **Date:** 2026-08-24
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

The application supports two distinct build and execution modes: Cloudflare Workers (using static pre-rendering and `@astrojs/cloudflare`) and a standalone Node server when `RENDER=true` (using `@astrojs/node`). Production is deployed at https://me.alehar.workers.dev/. A clear separation is required so that automated tools and test suites (such as Google Jules) can run in a Node standalone environment without treating that environment as a secondary production target or failover system.

## Decision

Production execution is strictly limited to Cloudflare Workers (`wrangler.jsonc`, `src/cloudflare-worker.ts`). Render serves solely as an isolated test and debugging environment for AI agents (Node server via `render.yaml`). Render is explicitly not a secondary production cluster or failover target.

## Consequences & Tradeoffs

- **Positive:** Clear architectural boundaries eliminate confusion regarding deployment targets and ensure production runtime optimization for Cloudflare Workers edge execution.
- **Negative / Risks:** Node standalone mode requires environment stubs (e.g., `src/env/cloudflare-workers.node.ts`) for Cloudflare Workers bindings (KV, AI), which must be maintained alongside production edge code.
- **Adoption Readiness:** Fully operational and verified; formalizing this decision prevents drift in CI/CD configurations and AI agent operations.

## Directives for AI Agents

- **Do:** Treat Cloudflare Workers as the sole production deployment target. Maintain compatibility stubs in `src/env/cloudflare-workers.node.ts` for Node test server execution.
- **Don't:** Treat Render Node server builds as a production environment or introduce failover/multi-cloud deployment logic.
