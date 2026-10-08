# 0002. Static Pre-Rendering with Cloudflare Workers Assets Binding

- **Status:** Accepted
- **Date:** 2026-10-08
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

The portfolio site prioritizes minimal latency, global availability, high SEO performance, and low execution overhead. Astro supports multiple output modes (`static`, `server`, `hybrid`). Cloudflare Workers provides high performance edge compute alongside static asset hosting through Workers + Assets bindings.

## Decision

The repository adopts static pre-rendering (`output: 'static'` in `astro.config.mjs`) as the default output mode, combined with the unified Cloudflare Workers + Assets binding model (`wrangler.jsonc` assets binding). On-demand server-side endpoints (e.g., `/api/chat`) execute as serverless worker routes alongside static asset delivery.

## Consequences & Tradeoffs

- **Positive:** Sub-millisecond initial byte delivery for static pages, zero SSR compute costs for portfolio views, and enhanced SEO/GEO visibility.
- **Negative / Risks:** Content updates require a static build deployment. Dynamic server routes must be explicitly configured as endpoint handlers (`export const prerender = false` if needed) or handle requests via Cloudflare Workers fetch handlers (`src/cloudflare-worker.ts`).
- **Adoption Readiness:** Fully production-tested and active across the repository.

## Directives for AI Agents

- **Do:** Keep `output: 'static'` in `astro.config.mjs` unless explicitly instructed otherwise.
- **Do:** Leverage static pre-rendering for all informational content, blog posts, work samples, and portfolio pages.
- **Do:** Use the modern Workers + Assets binding model in `wrangler.jsonc` rather than legacy Cloudflare Pages builds.
- **Don't:** Introduce server-side dynamic rendering for static pages or force global SSR adapters for standard page routes.
- **Don't:** Modify `wrangler.jsonc` assets or main entrypoint settings without verifying Cloudflare Workers routing compatibility.
