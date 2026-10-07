# 0002. Static Feature Flags via Type-Safe Content Collections

- **Status:** Accepted
- **Date:** 2026-08-25
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

Experimental UI micro-interactions, tactile feedback toggles, and temporary routes require runtime gating without introducing dynamic third-party JS dependencies, layout repaints, or dynamic client-side state stores.

## Decision

All experimental features, visual micro-interactions, and temporary routes are gated behind static JSON feature flags defined in `src/content/flags/config.json` and strictly validated via Zod schema in `src/content.config.ts`.

## Consequences & Tradeoffs

- **Positive:** Zero runtime JS payload overhead; full type safety and build-time validation via Astro Content Collections; straightforward toggling in JSON.
- **Negative / Risks:** Feature flag changes require static build and redeployment to take effect.
- **Adoption Readiness:** Implemented and actively governing tactile feedback, shimmer effects, and experimental portfolio components.

## Directives for AI Agents

- **Do:** Query feature flags using `getEntry('flags', 'config')` or `getCollection('flags')` in Astro components and scripts.
- **Do:** Define all new flag keys in `src/content/flags/config.json` with corresponding boolean Zod validation and default values in `src/content.config.ts`.
- **Don't:** Do not introduce third-party feature flag SDKs, external API calls, or client-side runtime stores for feature gating.
