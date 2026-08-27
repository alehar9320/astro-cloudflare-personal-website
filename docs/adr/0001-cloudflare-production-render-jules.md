# 0001. Cloudflare as Production, Render as Jules Test Environment

- **Status:** Accepted
- **Date:** 2026-08-24
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

The repository supports two build and execution targets: Cloudflare Workers (static Assets + `@astrojs/cloudflare` adapter) and a Node.js standalone server when `RENDER=true` (`@astrojs/node` adapter). Production is hosted at `https://me.alehar.workers.dev/` (and custom domains). AI agents (such as Google Jules) require a containerized Node.js environment to run sandbox server tests and debug dynamic capabilities without treating that secondary path as a production failover or multi-cloud deployment.

## Decision

Production environment is strictly Cloudflare Workers + Assets. Render is designated exclusively as a sandboxed test environment for Google Jules (running a standalone Node server via `render.yaml`). Render is NOT a secondary production target, backup host, or multi-region failover.

## Consequences & Tradeoffs

- **Positive:**
  - Clean separation of concerns between edge production deployment and AI testing runtime.
  - Clear architectural boundaries prevent accidental split-brain configuration or double deployments.
  - Allows Jules to execute Node server processes locally while keeping edge performance optimized.
- **Negative / Risks:**
  - Render environment lacks native Cloudflare bindings (Workers KV, Workers AI). Fallbacks and stubs are required (`src/env/cloudflare-workers.node.ts`).
  - Dual-adapter configuration (`astro.config.mjs`) adds slight complexity to build scripts.
- **Adoption Readiness:** Already implemented and operational in production and testing workflows.

## Directives for AI Agents

- **Do:**
  - Treat Cloudflare Workers (`wrangler.jsonc`, `src/cloudflare-worker.ts`) as the canonical production runtime.
  - Maintain Workers-First asset binding standards (`output: "static"` default in `astro.config.mjs`).
  - Use stubs in `src/env/cloudflare-workers.node.ts` when running under `RENDER=true`.
- **Don't:**
  - DO NOT introduce failover or production deployment logic targeting Render.
  - DO NOT add Node-specific native modules that break Cloudflare Workers builds.
  - DO NOT modify `wrangler.jsonc` bindings without verifying Cloudflare Workers compatibility.
