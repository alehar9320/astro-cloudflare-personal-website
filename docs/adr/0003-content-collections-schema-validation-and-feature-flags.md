# 0003. Content Collections Schema Validation and Static Feature Flags

- **Status:** Accepted
- **Date:** 2026-10-18
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

The personal portfolio manages both editorial content (such as work case studies) and static feature toggles (such as micro-interactions and experimental UI treatments). Unvalidated frontmatter or feature flag configurations can introduce runtime errors or broken layouts if missing required fields or invalid data types are deployed.

## Decision

- Centralize all content collection schemas in `src/content.config.ts` using Astro Content Collections and Zod (`astro/zod`).
- Store feature flags as static JSON configurations in `src/content/flags/` (e.g. `config.json`).
- Require all feature flag fields in Zod schemas to define explicit boolean default fallbacks (`z.boolean().default(false)`).

## Consequences & Tradeoffs

- **Positive:** Compile-time validation via `npm run check` (`astro check`) guarantees type safety for frontmatter and feature flags. Missing flags safely fall back to `false` without runtime crashes.
- **Negative / Risks:** Modifying feature flag structures requires updating both `src/content.config.ts` schema and `src/content/flags/config.json`.
- **Adoption Readiness:** Fully established and operational across content collections and feature toggles in `src/content.config.ts`.

## Directives for AI Agents

- **Do:** Centralize all content collection schemas and feature flag schemas in `src/content.config.ts`.
- **Do:** Provide explicit `.default(...)` fallbacks (e.g., `.default(false)`) for optional or boolean feature flag schema properties.
- **Do:** Validate content schema changes using `npm run check`.
- **Don't:** Bypass Zod schema definitions when introducing new content collections or feature toggles.
- **Don't:** Hardcode runtime feature toggles in component scripts without declaring them in `src/content.config.ts` and `src/content/flags/config.json`.
