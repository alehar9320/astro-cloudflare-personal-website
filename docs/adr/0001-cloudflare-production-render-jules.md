# 0001. Cloudflare Production and Render Jules Test Environment

- **Status:** Accepted
- **Date:** 2026-08-24
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

The site can build using two distinct adapter configurations: Cloudflare Workers (static + `@astrojs/cloudflare`) or a Node standalone server when `RENDER=true` (`@astrojs/node`). Production runs on Cloudflare Workers. We require a clear operational boundary so AI agents (such as Google Jules) can run and debug in a Node environment without treating that path as a second production deployment or failover environment.

## Decision

Production is strictly Cloudflare Workers. Render is designated exclusively as a test and debugging environment for Google Jules (running a Node server via `render.yaml`). Render is not a secondary production environment and not a failover node.

## Consequences & Tradeoffs

- **Positive:** Eliminates operational ambiguity and prevents accidental deployment or routing changes targeting non-production environments. Allows AI agents to leverage a Node-compatible runtime for isolated testing while preserving Cloudflare edge constraints in production.
- **Negative / Risks:** Node test runtime may lack full Cloudflare Worker bindings (such as Workers AI or KV), requiring environment stubs (`src/env/cloudflare-workers.node.ts`).
- **Adoption Readiness:** Established and actively used in production and CI/CD pipelines.

## Directives for AI Agents

- **Do:** Treat Cloudflare Workers (`wrangler.jsonc`) as the sole production runtime and deployment target.
- **Do:** Keep the Render Node deployment path isolated for agent evaluation and test server execution.
- **Don't:** Modify production release pipelines or CI workflows to deploy to Render or treat Render as a failover environment.
- **Don't:** Assume Cloudflare Worker bindings (KV, AI, Durable Objects) are available natively inside the Render Node test container without checking stubs.
