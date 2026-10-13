# ADR 0002: Static Output and Cloudflare Workers Entrypoint

- **Status:** Accepted
- **Date:** 2026-10-11
- **Deciders:** Alexander Härenstam

## Context

The portfolio site needs fast global delivery for static content and pages while supporting server endpoints (such as `/api/chat`, `/api/releases`, `/api/release-summary`, and `/api/visits`). In Astro, output strategy and Cloudflare Worker adapter behaviors determine how static assets and server endpoint requests are served.

## Decision

- Set `output: isRender ? 'server' : 'static'` in `astro.config.mjs` so production Cloudflare builds compile static HTML/assets by default, with server endpoints handled on demand.
- Implement the Cloudflare Worker custom entrypoint in `src/cloudflare-worker.ts`:
  - Delegates request handling to `astro.fetch(request, env, ctx)` imported from `@astrojs/cloudflare/entrypoints/server`.
  - Checks `isDirectNotFoundPath` for explicit direct 404 paths and delegates those specific requests to `fetchDirectNotFound(request, env.ASSETS)`.
- Author API routes (e.g. `src/pages/api/*.ts`) as Astro server endpoints handled by the Astro runtime handler rather than routing them directly inside `src/cloudflare-worker.ts`.

## Consequences & Tradeoffs

- **Positive:** High performance and edge caching for pre-rendered pages with zero cold-start penalty, while retaining Astro server endpoints for dynamic Worker logic.
- **Negative / Risks:** Direct 404 assets require explicit handling (`fetchDirectNotFound`) using the `ASSETS` binding when bypassed by Astro server rendering.
- **Adoption Readiness:** Fully operational and active in production.

## Directives for AI Agents

- **Do:** Keep `output: isRender ? 'server' : 'static'` in `astro.config.mjs`.
- **Do:** Ensure `src/cloudflare-worker.ts` delegates general requests to `astro.fetch(request, env, ctx)` and uses `env.ASSETS` via `fetchDirectNotFound` specifically for direct 404 paths.
- **Do:** Define server endpoints inside `src/pages/api/` as standard Astro endpoint handlers.
- **Don't:** Add manual custom routing for `/api/*` routes inside `src/cloudflare-worker.ts`.
- **Don't:** Assume `src/cloudflare-worker.ts` uses an `env.ASSETS.fetch` fallback for all non-404 static requests.
