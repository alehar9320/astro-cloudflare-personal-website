# 0002. Cloudflare Workers-First Architecture & Astro Static Prerendering

- **Status:** Accepted
- **Date:** 2026-08-24
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

The repository originally evaluated static hosting versus server-side rendering (SSR) across various cloud providers and legacy Cloudflare Pages models. To maximize performance, global edge distribution, zero-cold-start delivery, and strict environment control, the site architecture required a unified deployment model that supports static asset serving alongside edge worker capabilities when needed.

## Decision

Adopt Cloudflare Workers + Assets (Workers-First architecture) as the sole production runtime, combined with Astro static pre-rendering (`output: 'static'` in `astro.config.mjs`) and Zod schema validation for all structured data models.

1. **Unified Edge Model:** Deploy via Cloudflare Workers with Assets bindings (`wrangler.jsonc`) rather than deprecated Cloudflare Pages paradigms.
2. **Static Prerendering by Default:** All routes pre-render HTML at build time for optimal performance, low latency, and zero CLS.
3. **Strict Type and Schema Integrity:** All content structures and configuration schemas must be parsed and validated using Zod schemas at build/runtime.

## Consequences & Tradeoffs

- **Positive:** Exceptional TTFB worldwide, zero server infrastructure overhead, static asset optimization, robust compile-time schema validation, and predictable deployment pipeline via Cloudflare Git integration.
- **Negative / Risks:** Node.js native API availability is restricted at the edge runtime; server-side dynamic features require edge-compatible APIs or explicit Workers bindings.
- **Adoption Readiness:** Already fully implemented and active in production (`me.alehar.workers.dev`).

## Directives for AI Agents

- **Do:**
  - Keep `output: 'static'` in `astro.config.mjs` unless an explicit ADR defines SSR requirements.
  - Use Cloudflare Workers + Assets bindings (`wrangler.jsonc`) for all infrastructure configuration.
  - Validate all content structures and external API payloads using Zod schemas.
  - Run `npx wrangler types` when modifying Workers bindings or environment variables.
- **Don't:**
  - NEVER introduce legacy Cloudflare Pages configuration or deployment steps.
  - NEVER add heavy client-side JavaScript frameworks or Tailwind CSS.
  - NEVER use `@ts-ignore` or `any` to bypass TypeScript or Zod type constraints.
