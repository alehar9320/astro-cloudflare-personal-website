# 0002. Static Pre-Rendering with Cloudflare Workers Assets Binding

- **Status:** Accepted
- **Date:** 2026-03-28
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

The repository powers Alexander Härenstam's personal portfolio website, requiring optimal global load performance, zero cold-start latency for content pages, high reliability, and efficient edge delivery. While Astro supports server-side rendering (SSR), dynamic rendering introduces unnecessary server compute overhead and cold-start latency for static marketing and portfolio pages.

## Decision

Adopt static pre-rendering (`output: 'static'` in `astro.config.mjs`) as the default site output, deployed via the Cloudflare Workers + Assets binding model (`wrangler.jsonc` assets directory pointing to `./dist` with `ASSETS` binding). Server-side dynamic logic is isolated to specific Workers endpoints (`/api/chat`, `/api/visits`, `/api/releases`) and custom worker routes (`src/cloudflare-worker.ts`).

## Consequences & Tradeoffs

- **Positive:** Zero server cold-start latency for static routes, automatic global CDN distribution through Cloudflare Assets, maximum Core Web Vitals scores, reduced compute cost and operational complexity.
- **Negative / Risks:** Content updates require a static build and deployment pipeline; real-time dynamic page rendering requires client-side island hydration or dedicated Worker API bindings (`AI`, `CHAT_STORE`).
- **Adoption Readiness:** Implemented and active across the entire repository. Configured in `astro.config.mjs` and verified by production Cloudflare Workers builds.

## Directives for AI Agents

- **Do:** Keep `output: 'static'` as the default configuration in `astro.config.mjs` (switching to `server` only when `RENDER=true` for test environments). Build pages as static components with zero runtime server overhead.
- **Don't:** Do NOT convert static pages to SSR routes or remove the Cloudflare Workers Assets binding in `wrangler.jsonc`. Do NOT add server-only middleware that breaks static HTML pre-rendering.
