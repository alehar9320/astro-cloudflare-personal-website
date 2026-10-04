# 0002. Static Feature Flags via Type-Safe Content Collections

- **Status:** Accepted
- **Date:** 2026-10-04
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

Experimental features, visual micro-interactions, and temporary routes need to be safely gated without requiring dynamic external feature flagging services or complex runtime evaluation overhead. Furthermore, feature flags must be type-safe across the Astro build pipeline and content collection layer.

## Decision

All experimental features, visual micro-interactions, and feature toggles must be defined as static JSON flags in `src/content/flags/config.json` and validated strictly via Zod schema in `src/content.config.ts`.

## Consequences & Tradeoffs

- **Positive:**
  - Zero dynamic runtime cost or external network requests at edge runtime.
  - Full TypeScript type-safety and compile-time validation via Astro Content Collections and Zod schemas.
  - Easy toggle management across feature development iterations.
- **Negative / Risks:**
  - Toggling a flag requires a build/re-deployment rather than an instant dynamic remote configuration change.
- **Adoption Readiness:** Already implemented and actively used across multiple components and experimental flags.

## Directives for AI Agents

- **Do:**
  - Add new feature flags to `src/content/flags/config.json` with a boolean default value.
  - Declare and validate every feature flag in `src/content.config.ts` under the `flags` collection schema.
  - Query feature flags using `getCollection('flags')` or `getEntry('flags', 'config')` in Astro components.
- **Don't:**
  - Do not hardcode unvalidated flag boolean values directly in component logic without registering them in `src/content/flags/config.json` and `src/content.config.ts`.
  - Do not introduce dynamic remote feature flag third-party client libraries.
