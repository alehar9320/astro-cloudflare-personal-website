# 0002. Static Feature Flags via Type-Safe Content Collections

- **Status:** Accepted
- **Date:** 2026-08-24
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

Experimental UI features, visual micro-interactions, tactile feedback transforms, and temporary route variations need to be safely gated and tested without introducing third-party feature flag runtime SDKs (such as LaunchDarkly or Statsig) or adding dynamic network/edge lookups for static content.

## Decision

All feature flags are statically declared in `src/content/flags/config.json` and strictly validated via Zod schema in Astro's content collection system (`src/content.config.ts`).

## Consequences & Tradeoffs

- **Positive:** Zero runtime latency overhead, compile-time/build-time type safety across all components, static tree-shaking capability, and zero external SDK dependencies or costs.
- **Negative / Risks:** Flag state toggles require a static build and redeploy rather than instant runtime toggles; flags apply globally per build artifact rather than per user segment.
- **Adoption Readiness:** Already fully implemented and in active production use across components (`Nav.astro`, `CallToAction.astro`, etc.).

## Directives for AI Agents

- **Do:** Gate experimental components or visual micro-interactions behind static feature flags declared in `src/content/flags/config.json`. Always update the `flags` Zod schema in `src/content.config.ts` when introducing a new flag.
- **Don't:** Import third-party feature flagging SDKs or write client-side runtime flag fetchers. Do not bypass Zod schema validation when adding or editing flags.
