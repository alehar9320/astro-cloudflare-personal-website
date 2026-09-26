# 0002. Static Feature Flags via Type-Safe Content Collections

- **Status:** Accepted
- **Date:** 2026-09-26
- **Deciders:** Autonomous Architect (Archie)

## Context

Autonomous AI feature agents (e.g., `Jules`, `Apex`, `Kinetic`, `Aurora`) frequently introduce experimental micro-interactions, UI enhancements, or temporary routes. To prevent unvetted code from breaking production layout or causing unhandled runtime errors, a standardized, lightweight feature flagging mechanism is required. Third-party SaaS feature flag providers (e.g., LaunchDarkly, Optimizely) introduce unnecessary bundle overhead, network latency, and external API dependency risks for a personal portfolio site.

## Decision

All experimental features, visual micro-interactions, and experimental page routes MUST be gated behind static JSON feature flags defined in `src/content/flags/config.json` and validated strictly at build time via Astro's `flags` content collection schema in `src/content.config.ts` using Zod (`z.boolean()`).

## Consequences & Tradeoffs

- **Positive:**
  - Zero client-side network latency or runtime SDK overhead.
  - Strict build-time type safety—unknown feature flag keys or invalid types fail `npm run astro check` and `npm test` build pipelines immediately.
  - Deterministic testing—flags can be toggled on/off in unit tests via mock context.
- **Negative / Risks:**
  - Toggling a feature flag requires a commit and static site build/re-deploy.
  - Feature flag schema in `src/content.config.ts` must be manually updated whenever a new flag is added.
- **Adoption Readiness:**
  - Active codebase convention supported across `Apex`, `Jules`, and `Aurora` agents.

## Directives for AI Agents

- **Do:**
  - Define all new experimental feature flags in `src/content/flags/config.json` with a boolean default (`false` for unreleased features).
  - Register the new flag property in `src/content.config.ts` under `flags` schema with `z.boolean().default(false)`.
  - Import and query feature flags statically via `getEntry('flags', 'config')` in Astro components or utility functions before rendering experimental UI elements.
- **Don't:**
  - Do NOT create experimental page routes or UI micro-interactions without feature flag isolation.
  - Do NOT introduce third-party feature flag libraries or dynamic network-fetched flag endpoints.
  - Do NOT use `any` or bypass Zod validation when parsing flag configurations.
