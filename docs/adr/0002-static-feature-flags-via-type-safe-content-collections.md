# 0002. Static Feature Flags via Type-Safe Content Collections

- **Status:** Accepted
- **Date:** 2026-09-28
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

Experimental features, visual micro-interactions, and temporary portfolio routes require gating behind feature flags to prevent unauthorized or incomplete features from affecting production rendering. Third-party feature flag services introduce external runtime dependencies, network latency, and complexity that conflict with a lean static/edge website.

## Decision

We establish static feature flag gating using Astro Content Collections. Flags are defined in `src/content/flags/config.json` and strictly validated against a Zod schema in `src/content.config.ts`. All experimental features, UI micro-interactions, or temporary routes must read from this type-safe feature flag collection before rendering.

## Consequences & Tradeoffs

- **Positive:** Zero external runtime dependencies; zero latency during build and edge evaluation; strict build-time type safety via Zod schema validation; easy gating for autonomous agent feature development.
- **Negative / Risks:** Toggling a flag requires a codebase edit and deployment rather than dynamic runtime toggle.
- **Adoption Readiness:** Already fully implemented and validated in `src/content/flags/config.json` and `src/content.config.ts`.

## Directives for AI Agents

- **Do:**
  - Define all new experimental UI feature flags inside `src/content/flags/config.json`.
  - Update the Zod schema in `src/content.config.ts` whenever adding a new feature flag key.
  - Gate experimental components and micro-interactions behind flag checks fetched via `getCollection('flags')` or `getEntry('flags', 'config')`.
- **Don't:**
  - Do NOT import external runtime feature flag libraries or dynamic remote flag SDKs.
  - Do NOT hardcode experimental UI states without flag gating.
