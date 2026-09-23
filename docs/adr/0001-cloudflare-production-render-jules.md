# 0001. Cloudflare as Production, Render as Jules Test Environment

- **Status:** Accepted
- **Date:** 2026-08-24
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

The site can build two ways: Cloudflare Workers (static + `@astrojs/cloudflare`) or a Node standalone server when `RENDER=true` (`@astrojs/node`). Prod already runs at https://me.alehar.workers.dev/. We need a clear split so Google Jules can debug against a Node environment without treating that path as a second production or failover.

## Decision

Production is Cloudflare Workers only. Render is a test environment for Google Jules (Node server via `render.yaml`). It is not a second prod and not a failover.

## Consequences & Tradeoffs

- **Positive:**
  - Eliminates operational ambiguity around primary deployment target.
  - Isolates Node standalone execution to test/debug loops without compromising edge runtime optimizations.
- **Negative / Risks:**
  - Render Node path requires maintainers to keep fallback stubs (`src/env/cloudflare-workers.node.ts`) up-to-date for missing Workers bindings.
- **Adoption Readiness:** High. Established convention across CI/CD and repository configs.

## Directives for AI Agents

- **Do:**
  - Treat Cloudflare Workers (`wrangler.jsonc`, `src/cloudflare-worker.ts`) as the sole production target.
  - Use `RENDER=true` and `@astrojs/node` strictly for Jules automated test / debugging workflows in `render.yaml`.
- **Don't:**
  - Do NOT treat Render as a production failover or multi-region secondary deployment.
  - Do NOT break Cloudflare Workers bindings or build steps when making changes for the Node test environment.
