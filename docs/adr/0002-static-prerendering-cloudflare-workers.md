# 0002. Static Pre-Rendering with Cloudflare Workers Assets Binding

- **Status:** Accepted
- **Date:** 2026-03-31
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

The portfolio site prioritizes sub-millisecond edge response times, absolute zero-runtime overhead for content pages, high Core Web Vitals, and low hosting costs. Astro supports both static site generation (SSG) and server-side rendering (SSR). A decision is required on the primary rendering model and edge integration pattern.

## Decision

Adopt static pre-rendering (`output: 'static'` in `astro.config.mjs`) deployed to Cloudflare Workers with Assets binding (`wrangler.jsonc`). Edge worker logic (`src/cloudflare-worker.ts`) handles asset serving via `env.ASSETS.fetch` and intercepted worker-first routes (such as dynamic `/404`).

## Consequences & Tradeoffs

- **Positive:** Perfect performance baseline (100 Lighthouse target), instantaneous static asset delivery via Cloudflare CDN edge, minimal worker execution costs.
- **Negative / Risks:** Pages requiring runtime dynamism must rely on client-side fetch calls to API endpoints, static islands, or Workers bindings rather than full server-side page rendering.
- **Adoption Readiness:** Currently active in `astro.config.mjs` and `wrangler.jsonc`.

## Directives for AI Agents

- **Do:** Keep `output: 'static'` as the default rendering output in `astro.config.mjs` unless explicitly configured for test runtimes.
- **Do:** Serve static pages pre-rendered at build time; route client-side interactivity to lightweight component islands or isolated edge API handlers.
- **Don't:** Switch global Astro configuration to full SSR (`output: 'server'`) for production builds.
- **Don't:** Bypass `env.ASSETS.fetch` in `src/cloudflare-worker.ts` when processing static asset requests on Cloudflare Workers.
