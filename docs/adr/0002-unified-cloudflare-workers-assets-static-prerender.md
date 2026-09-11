# 0002. Unified Cloudflare Workers + Assets Architecture with Static Pre-rendering

- **Status:** Accepted
- **Date:** 2026-03-30
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

Personal portfolio performance, SEO, edge delivery, and low operational overhead are primary requirements for this repository. Legacy Cloudflare Pages deployment models lack full worker binding integration flexibility compared to the modern Cloudflare Workers + Assets architecture. Furthermore, static pre-rendering provides zero-latency content delivery while edge worker bindings enable dynamic capabilities (e.g., KV stores for chat, Workers AI, Sentry/PostHog telemetry).

## Decision

Adopt the unified Cloudflare Workers + Assets architecture (`wrangler.jsonc`) with default static pre-rendering (`output: "static"` in `astro.config.mjs`). Route handling and custom edge logic execute directly through `./src/cloudflare-worker.ts`, serving pre-rendered static assets from `./dist` via the `ASSETS` binding while maintaining direct access to Workers AI, KV namespaces, and observability bindings.

## Consequences & Tradeoffs

- **Positive:** Instant static asset delivery at edge locations with full native access to Cloudflare Workers APIs and bindings. Eliminates legacy Cloudflare Pages adapter limitations.
- **Negative / Risks:** Local testing and non-Workers environments require emulation layers (`wrangler dev` or Node standalone stubs) for Worker bindings.
- **Adoption Readiness:** Fully established pattern; `wrangler.jsonc` and `astro.config.mjs` are configured and verified in production.

## Directives for AI Agents

- **Do:** Preserve static pre-rendering by default (`output: "static"`). Use `wrangler.jsonc` as the canonical source for bindings (`ASSETS`, `CHAT_STORE`, `AI`, environment variables).
- **Don't:** Introduce legacy Cloudflare Pages configuration files (`_routes.json`, `_headers` or `@astrojs/cloudflare` Pages mode). Do not alter `wrangler.jsonc` binding configurations without verifying Workers-first architecture impact.
