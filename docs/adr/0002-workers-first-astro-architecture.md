# 0002. Workers-First Static Astro Architecture with Pure Vanilla CSS

- **Status:** Accepted
- **Date:** 2026-03-29
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

The portfolio needs to deliver extreme fast loading times, high SEO scores, edge deployment resilience, and simple maintenance. Heavy CSS frameworks (like Tailwind CSS) or client-side JavaScript UI libraries introduce bundle bloat and runtime overhead. Furthermore, dynamic server rendering for static content adds unnecessary edge latency and cost.

## Decision

The site uses Astro configured with static prerendering (`output: "static"` in `astro.config.mjs`) deployed on Cloudflare Workers + Assets (`wrangler.jsonc`).
Styling is strictly authored in pure Vanilla CSS using scoped `<style>` blocks or core stylesheet modules.
All content schemas and runtime data interfaces are governed strictly by Zod schemas in TypeScript.

## Consequences & Tradeoffs

- **Positive:**
  - Near-instant global TTFB and zero CLS due to static pre-rendering at Cloudflare edge nodes.
  - Minimal client JS footprint, ensuring accessibility and high performance across low-power mobile devices.
  - Complete type safety across content collections and API boundaries using Zod.
- **Negative / Risks:**
  - Requires writing Vanilla CSS utility classes and layout primitives manually without framework design tokens.
  - Client-side interactivity requires native Web APIs or lightweight vanilla JavaScript components instead of framework UI states.
- **Adoption Readiness:** High confidence; established as the core foundation across the codebase.

## Directives for AI Agents

- **Do:** Author component styles using Vanilla CSS inside component `<style>` blocks or `src/styles/`.
- **Do:** Use strict TypeScript types and Zod schemas for all data mutations, content collections, and API inputs.
- **Do:** Maintain static page pre-rendering (`output: "static"`) unless an explicit edge endpoint requires SSR.
- **Don't:** Introduce Tailwind CSS, Bootstrap, or any third-party CSS utility frameworks.
- **Don't:** Add client-side JavaScript UI frameworks (React, Vue, Svelte) or heavy UI state libraries.
- **Don't:** Use `@ts-ignore`, `any`, or bypass type checks.
