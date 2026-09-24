# 0002. Workers-First Assets Architecture on Cloudflare

- **Status:** Accepted
- **Date:** 2026-09-24
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

Cloudflare legacy Pages models used `_routes.json` routing configuration and `_headers` files for static assets and routing. Modern Cloudflare Workers + Assets architecture unifies static asset serving and edge computing into a single worker deployment configured via `wrangler.jsonc` and `astro.config.mjs` using `@astrojs/cloudflare`.

To prevent AI agents from re-introducing legacy Cloudflare Pages deployment manifests or deprecated configuration files, we need to codify the Workers-First Assets pattern as the repository standard.

## Decision

Standardize exclusively on the Cloudflare Workers + Assets architecture:

1. Configuration is managed via `wrangler.jsonc`.
2. Build adapter is `@astrojs/cloudflare` with prerender and worker entrypoints in `src/cloudflare-worker.ts`.
3. Legacy Cloudflare Pages constructs (`_routes.json`, legacy `pages:build` commands) are deprecated and prohibited in this codebase.

## Consequences & Tradeoffs

- **Positive:** Complete programmatic control over edge execution, unified local development using Wrangler CLI, zero friction when accessing edge bindings (KV, Vectorize, Workers AI).
- **Negative / Risks:** Direct worker configuration requires understanding Workers bindings in `wrangler.jsonc` and typing via `wrangler types`.
- **Adoption Readiness:** Already fully implemented in production and repository scripts.

## Directives for AI Agents

- **Do:**
  - Configure Cloudflare edge settings exclusively in `wrangler.jsonc`.
  - Use `@astrojs/cloudflare` for building edge production assets.
  - Define and maintain worker entrypoints in `src/cloudflare-worker.ts`.
  - Run `npx wrangler types` when updating bindings or worker configurations.
- **Don't:**
  - **NEVER** introduce or generate legacy Cloudflare Pages files such as `_routes.json` or `pages.config.json`.
  - **NEVER** use deprecated Cloudflare Pages deployment models or adapters.
  - **NEVER** modify `wrangler.jsonc` without preserving the Workers + Assets binding model.
