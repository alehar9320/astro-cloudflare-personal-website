# 0002. Workers-First Assets Binding Architecture

- **Status:** Accepted
- **Date:** 2026-03-30
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

Cloudflare legacy Pages deployment patterns separated static asset hosting from custom edge logic (`functions/` directory or `_routes.json`). Cloudflare introduced the unified Workers + Assets binding model, which allows a single Cloudflare Worker (`wrangler.jsonc`) to serve pre-rendered static assets from a directory (e.g., `./dist`) while exposing native Workers bindings (KV, Workers AI, environment variables) and custom Workers entry points.

## Decision

Standardize exclusively on the Workers + Assets binding model (`wrangler.jsonc`).
Static site output from Astro (`output: "static"`) is bundled into `./dist` and bound as `ASSETS` inside `wrangler.jsonc`. Custom Worker routing and fallback logic live in `src/cloudflare-worker.ts`.

## Consequences & Tradeoffs

- **Positive:** Single unified Cloudflare Worker configuration; direct access to native KV (`CHAT_STORE`), Workers AI (`AI`), and environment variables; eliminates legacy `_routes.json` complexity.
- **Negative / Risks:** Developer environment requires `wrangler` CLI or Cloudflare Workers tooling to emulate full binding environment locally.
- **Adoption Readiness:** Implemented and actively operating in production.

## Directives for AI Agents

- **Do:** Maintain all Cloudflare configuration strictly inside `wrangler.jsonc`.
- **Do:** Run `npx wrangler types` when modifying Workers bindings or environment variables.
- **Do:** Place edge Worker entry logic in `src/cloudflare-worker.ts`.
- **Don't:** Introduce legacy Cloudflare Pages routing files (`_routes.json`) or `functions/` directory structures.
- **Don't:** Switch output configuration away from Workers-first architecture without an approved ADR proposal.
