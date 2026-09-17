# 0002. Cloudflare Workers + Assets Unified Architecture

- **Status:** Accepted
- **Date:** 2026-03-30
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

Cloudflare transitioned static asset hosting and edge functions under a unified Workers + Assets model configured via `wrangler.jsonc`. Previous deployment patterns relied on Cloudflare Pages or multi-step manual deployment tasks in CI pipelines. The repository migrated to Astro with `@astrojs/cloudflare` and `wrangler.jsonc` to align with the Workers-first architecture.

## Decision

Adopt the unified Cloudflare Workers + Assets architecture (`wrangler.jsonc` and `src/cloudflare-worker.ts`) as the single canonical production deployment target. Production auto-deploys are handled exclusively via Cloudflare Git integration on pushes to `main`. CI GitHub Actions workflows validate quality checks and create GitHub releases without modifying `main` or running redundant manual wrangler deployment steps.

## Consequences & Tradeoffs

- **Positive:** Eliminates dual-deploy race conditions, reduces CI runtime by delegating build/deploy to Cloudflare Workers infrastructure, and unifies static assets with edge Worker bindings (KV, AI, env vars).
- **Negative / Risks:** Local development requires `wrangler` CLI or `astro dev` with worker bindings stubbing. Non-Cloudflare test environments (such as Render Node adapter) require adapter switching (`RENDER=true`).
- **Adoption Readiness:** High confidence; live production (`https://me.alehar.workers.dev`) is operating successfully on this model.

## Directives for AI Agents

- **Do:** Use `wrangler.jsonc` for Worker bindings and environment configuration. Maintain static output (`output: "static"`) with Cloudflare adapter in `astro.config.mjs`.
- **Don't:** Do not introduce legacy Cloudflare Pages configuration files (`_routes.json`, `_headers` in static roots) or add manual `wrangler deploy` steps in GitHub Actions CI workflows. Do not modify `wrangler.jsonc` without verifying Workers-first impact.
