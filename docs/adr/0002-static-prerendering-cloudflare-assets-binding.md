# 0002. Static Pre-Rendering with Cloudflare Workers Assets Binding

- **Status:** Accepted
- **Date:** 2026-10-11
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

The personal portfolio website needs fast global performance, zero cold-start latency for static content, and minimal compute costs while supporting dynamic Workers endpoints (e.g. chat AI, release summaries, visit tracking). Astro supports multiple output modes (`static`, `server`, or hybrid) and deployment adapters.

## Decision

Adopt static pre-rendering (`output: 'static'` in `astro.config.mjs`) by default, combined with Cloudflare Workers Assets binding (`binding: "ASSETS"` in `wrangler.jsonc`).

- Pages and static assets are fully compiled to static files in `./dist` at build time.
- The Cloudflare Worker entrypoint (`src/cloudflare-worker.ts`) handles incoming requests, serving static assets via `env.ASSETS.fetch(request)` and routing dynamic API requests (such as `/api/chat`, `/api/releases`, and `/api/visits`) to dedicated Worker logic.

## Consequences & Tradeoffs

- **Positive:** Maximum edge caching performance, instant TTFB for content pages, zero serverless compute execution overhead for pre-rendered HTML/CSS/JS, and simple static build verification via `npm run build`.
- **Negative / Risks:** Pages requiring server-side dynamic rendering must explicitly manage client-side dynamic fetching or API endpoint integration rather than Astro SSR frontmatter compute.
- **Adoption Readiness:** Fully operational and validated in production deployment.

## Directives for AI Agents

- **Do:** Keep `output: 'static'` in `astro.config.mjs` for production Cloudflare builds.
- **Do:** Ensure asset requests fall back to `env.ASSETS.fetch(request)` in `src/cloudflare-worker.ts`.
- **Don't:** Change Astro configuration to default `output: 'server'` or `output: 'hybrid'` for Cloudflare Workers builds without an explicit ADR proposal.
- **Don't:** Remove the `ASSETS` binding from `wrangler.jsonc` or `worker-configuration.d.ts`.
