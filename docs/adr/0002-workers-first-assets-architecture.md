# 0002. Unified Cloudflare Workers + Assets Architecture

- **Status:** Accepted
- **Date:** 2026-09-20
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

Cloudflare legacy deployment models (e.g., Cloudflare Pages) introduced fragmented configuration paradigms across `_routes.json`, build outputs, and worker bindings. The repository requires a unified, edge-native architecture for high performance, simplified binding management, and consistent CI/CD deployment.

## Decision

Adopt the unified Cloudflare Workers + Assets architecture configured directly via `wrangler.jsonc` and `src/cloudflare-worker.ts`, utilizing `@astrojs/cloudflare` adapter with static pre-rendering output (`output: "static"`).

## Consequences & Tradeoffs

- **Positive:**
  - Single configuration file (`wrangler.jsonc`) managing bindings, static assets, and Worker behaviors.
  - Consistent static pre-rendering output for edge performance with dynamic fallback capability.
  - Seamless Git integration with Cloudflare Workers auto-deploys.
- **Negative / Risks:**
  - Requires strict adherence to Cloudflare Worker runtime constraints and ES module standards.
  - Requires stubbing bindings when running non-Worker test setups (e.g. Node standalone integration).
- **Adoption Readiness:** High confidence, production-proven in this repository across all main site builds.

## Directives for AI Agents

- **Do:**
  - Maintain all Worker bindings and static asset rules inside `wrangler.jsonc`.
  - Use `output: "static"` in `astro.config.mjs` with `@astrojs/cloudflare` adapter.
  - Run `npx wrangler types` when modifying worker binding schemas.
- **Don't:**
  - Introduce legacy Cloudflare Pages deployment models or `_routes.json` files.
  - Direct write to protected `main` for release deployment automation.
