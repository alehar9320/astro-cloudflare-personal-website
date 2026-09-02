# 0002. Feature Flag Isolation and Type-Safe Content Collections

- **Status:** Accepted
- **Date:** 2026-03-30
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

The Personal Portfolio repository is evolved by multiple autonomous AI agents (Apex, Jules, Kinetic, Palette, Aurora, Vantage) and human contributors. To prevent regressions, breaking schema changes, or accidental global layout disruptions during rapid iteration, the codebase requires strict structural guardrails for micro-features, content schemas, and runtime isolation.

## Decision

All experimental or incremental feature toggles must be defined in `src/content/flags/config.json` and validated by Zod schema definitions in `src/content.config.ts`. Additionally:

1. Every new feature flag added to `src/content/flags/config.json` must be declared in the `flags` collection schema in `src/content.config.ts` (e.g., `enable_feature_name: z.boolean().default(false)`).
2. Content collections (such as `work` and `flags`) must use strict Zod schemas for compile-time and runtime type safety.
3. Features or experimental routes must be isolated within `src/pages/experimental/` or guarded by a feature flag check rather than modifying core global layouts (`Layout.astro` or worker logic).

## Consequences & Tradeoffs

- **Positive:** Guarantees zero-runtime-type errors on content/flags, ensures reversible feature rollouts, and provides predictable boundary isolation for autonomous agent contributions.
- **Negative / Risks:** Modifying flags requires synchronizing `src/content/flags/config.json` with `src/content.config.ts` to maintain schema validation tests.
- **Adoption Readiness:** Already in active use across autonomous agent tracks (`Jules`, `Apex`, `Palette`, `Aurora`) and verified via `src/__tests__/` Vitest suites.

## Directives for AI Agents

- **Do:** Synchronize any new flag added in `src/content/flags/config.json` with the Zod schema in `src/content.config.ts`.
- **Do:** Isolate experimental or WIP features in `src/pages/experimental/` or behind feature flag conditionals.
- **Don't:** Do not introduce third-party feature flagging libraries or external remote config services; use the local Zod-backed content collection flags.
- **Don't:** Do not bypass Zod type checking or use `@ts-ignore` / `any` when handling content collection data.
