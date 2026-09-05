# 0002. Workers-First Architecture and Static Pre-Rendering Model

- **Status:** Accepted
- **Date:** 2026-08-25
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

The website needs to deliver near-zero latency worldwide for static portfolio pages while supporting dynamic edge features (such as AI chat streams, visitor analytics, and version APIs). Previously, static hosting models like Cloudflare Pages used separate deployment paradigms from pure Cloudflare Workers, leading to conflicting configuration formats and deployment friction.

## Decision

Adopt Cloudflare's modern Workers-First model with Assets binding (`wrangler.jsonc`) and default Astro static pre-rendering (`output: "static"` in `astro.config.mjs`). Dynamic API endpoints and edge worker handlers route through `src/cloudflare-worker.ts` and runtime Workers bindings.

## Consequences & Tradeoffs

- **Positive:** Unifies static content hosting and dynamic edge APIs under a single `wrangler.jsonc` configuration file, maximizing edge cache hits while keeping dynamic edge computing available.
- **Negative / Risks:** Static pre-rendering requires strict separation between build-time static generation and request-time edge execution.
- **Adoption Readiness:** Production-proven and implemented across the entire Astro build and Cloudflare deployment lifecycle.

## Directives for AI Agents

- **Do:** Keep `output: "static"` in `astro.config.mjs` as the default Astro output model.
- **Do:** Declare Cloudflare Workers bindings (KV, Workers AI, Assets) in `wrangler.jsonc`.
- **Don't:** Introduce legacy Cloudflare Pages deployment models or configuration files (`_routes.json`, `_headers` files specific to Pages).
- **Don't:** Add server-side rendering (`export const prerender = false`) to static pages unless explicit edge runtime dynamic processing is required.
