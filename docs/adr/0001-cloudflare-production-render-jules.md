# 0001. Cloudflare as Production, Render as Jules Test Env

- **Status:** Accepted
- **Date:** 2026-08-24
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

The site can build in two distinct environments: Cloudflare Workers (`@astrojs/cloudflare` adapter with static asset pre-rendering) or as a standalone Node server when `RENDER=true` (`@astrojs/node` adapter). Production is hosted at https://me.alehar.workers.dev/. We require an unambiguous architectural boundary so that AI agents (e.g. Google Jules) can debug and verify runtime logic in a Node environment without treating that path as a secondary production deployment, multi-cloud setup, or failover target.

## Decision

Production is strictly Cloudflare Workers. Render is designated exclusively as a sandboxed test and debugging environment for AI agents (executing a Node server via `render.yaml`). Render is not a secondary production deployment and not a failover system.

## Consequences & Tradeoffs

- **Positive:** Unifies production deployment on Cloudflare Workers edge runtime; eliminates drift or confusion regarding multi-region deployment. Allows AI agents to run isolated end-to-end integration tests on Node.
- **Negative / Risks:** Node-based Render environment lacks native Cloudflare Workers bindings (e.g. KV, AI bindings), requiring stubbing (`src/env/cloudflare-workers.node.ts`).
- **Adoption Readiness:** Already implemented and operational.

## Directives for AI Agents

- **Do:**
  - Treat Cloudflare Workers as the sole production target.
  - Use the `@astrojs/node` standalone adapter strictly for Render test environment builds (`RENDER=true`).
  - Ensure Workers bindings are safely stubbed when executing under the Render Node path (`src/env/cloudflare-workers.node.ts`).
- **Don't:**
  - **NEVER** treat Render as a production environment or failover target in documentation, configuration, or code logic.
  - **NEVER** introduce production failover logic or multi-cloud deployment scripts routing production traffic to Render.
