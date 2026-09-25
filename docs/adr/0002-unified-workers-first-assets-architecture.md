# 0002. Unified Cloudflare Workers + Assets Architecture

- **Status:** Accepted
- **Date:** 2026-03-29
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

Cloudflare deprecated legacy Pages deployments in favor of the unified Cloudflare Workers platform with static Assets bindings (`wrangler.jsonc`). The portfolio site requires static HTML/CSS pre-rendering for speed and SEO, combined with dynamic edge capability for Workers AI, KV storage (`CHAT_STORE`), and custom asset route handling. We need a clear architectural standard governing static output generation, edge asset binding, and custom worker entrypoints.

## Decision

Adopt the Cloudflare Workers + Assets architecture as the canonical production infrastructure model:

1. Output mode is strictly `static` in `astro.config.mjs` via `@astrojs/cloudflare` adapter.
2. `wrangler.jsonc` defines static assets binding (`"binding": "ASSETS"`, `"directory": "./dist"`) with `"run_worker_first": ["/404", "/404/"]` for custom error handling.
3. `src/cloudflare-worker.ts` serves as the primary Cloudflare Worker entrypoint delegating static requests to `env.ASSETS.fetch(request)`.
4. Edge bindings (KV `CHAT_STORE`, Workers `AI`) are declared directly in `wrangler.jsonc` and accessed in edge utilities.

## Consequences & Tradeoffs

- **Positive:** Unifies static asset delivery with serverless edge compute under a single Cloudflare Worker config; eliminates legacy Pages build artifacts and deployment drift; provides ultra-fast LCP via global CDN caching.
- **Negative / Risks:** Local development and non-Cloudflare environments (e.g. Node test environment) require explicit environment variable stubs or adapter switches (`astro.config.mjs`).
- **Adoption Readiness:** Already fully implemented in `wrangler.jsonc`, `astro.config.mjs`, and `src/cloudflare-worker.ts`.

## Directives for AI Agents

- **Do:** Keep `output: "static"` as the default output mode in `astro.config.mjs`.
- **Do:** Declare all edge bindings (KV namespaces, Workers AI, environment variables) in `wrangler.jsonc`.
- **Do:** Run `npx wrangler types` when modifying worker bindings in `wrangler.jsonc`.
- **Don't:** Introduce legacy Cloudflare Pages configuration (`_routes.json` or `functions/` directory).
- **Don't:** Use client-side JS hydration (`client:load`, `client:only`) when static pre-rendered HTML/CSS is sufficient.
