# 0002. Static Feature Flags via Type-Safe Content Collections

- **Status:** Accepted
- **Date:** 2026-08-24
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

Experimental UI features, visual micro-interactions, and temporary routes need a lightweight, type-safe mechanism for gating without incurring external network latency, runtime JS SDK dependencies, or dynamic feature-flag SaaS costs.

## Decision

Gate experimental features and micro-interactions behind static JSON feature flags defined in `src/content/flags/config.json` and validated strictly via Zod schema in `src/content.config.ts` using Astro Content Collections (`flags` collection).

## Consequences & Tradeoffs

- **Positive:** Type-safe compile-time flag schema with Zod validation. Zero client-side JS overhead or external SDK bundle bloat. Completely predictable static build behavior.
- **Negative / Risks:** Toggling a flag requires a code edit and static site rebuild/redeploy rather than a dynamic instant dashboard toggle.
- **Adoption Readiness:** Established pattern across components and agents (e.g. tactile feedback, shimmer, reading list).

## Directives for AI Agents

- **Do:** Access feature flags strictly via `getEntry('flags', 'config')` or Zod schema defined in `src/content.config.ts`. Ensure new flags have boolean default values in `src/content.config.ts`.
- **Don't:** Introduce external feature flagging libraries (e.g. LaunchDarkly, Optimizely, PostHog feature flags) or dynamic network fetch calls for UI feature toggling.
