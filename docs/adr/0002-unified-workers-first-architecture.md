# 0002. Unified Workers-First Architecture and Static Pre-Rendering Strategy

- **Status:** Accepted
- **Date:** 2026-03-30
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

Alexander Härenstam's portfolio needs to maintain ultra-fast page load times, strict SEO compliance, zero server cold starts for static routes, and seamless edge compute integration for dynamic features (e.g., chat, stats, and releases API). Previous Cloudflare Pages models separated edge functions from asset serving, introducing operational complexity and runtime binding divergence.

## Decision

Adopt a Unified Workers-First Architecture using the Cloudflare Workers + Assets model (`wrangler.jsonc` and `src/cloudflare-worker.ts`) with Astro set to static pre-rendering mode (`output: "static"` in `astro.config.mjs`). Dynamic API endpoints run directly on the Cloudflare Worker edge runtime, while static HTML, CSS, and asset pages are served with zero compute overhead via Cloudflare Assets.

## Consequences & Tradeoffs

- **Positive:** Sub-millisecond static response times, single-configuration `wrangler.jsonc` deployment, direct access to Cloudflare Workers KV and AI bindings without multi-service orchestration.
- **Negative / Risks:** Legacy Cloudflare Pages build patterns are incompatible; local development requires `wrangler` bindings or Node environment fallbacks.
- **Adoption Readiness:** Production-proven in this repository; all core routes (`/`, `/work`, `/about`, `/whats-new`) are pre-rendered statically while serverless API routes handle dynamic runtime interactions.

## Directives for AI Agents

- **Do:** Preserve `output: "static"` in `astro.config.mjs` unless explicitly instructed otherwise.
- **Do:** Maintain Workers + Assets binding configuration in `wrangler.jsonc`.
- **Don't:** Introduce legacy Cloudflare Pages deployment models (`_routes.json`, legacy `functions/` directory).
- **Don't:** Add server-side rendering (`output: "server"`) globally across static content routes.
