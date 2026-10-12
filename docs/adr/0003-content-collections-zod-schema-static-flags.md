# 0003. Content Collections Schema Validation and Static Feature Flags

- **Status:** Accepted
- **Date:** 2026-03-30
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

The repository manages structured portfolio data (such as case studies in `src/content/work/`) and site feature toggles (in `src/content/flags/`). Without strict schema enforcement, frontmatter fields and feature flags can drift, leading to runtime type errors, missing properties, or invalid frontmatter formats across pages and components.

## Decision

- Enforce strict type safety and frontmatter validation using Astro Content Collections with Zod schemas defined centrally in `src/content.config.ts`.
- Store site feature flags as static JSON files in `src/content/flags/` validated by Zod schemas with explicit default fallback values (`z.boolean().default(false)`).
- Ensure all content collections and flag schema changes pass `npm run check` and dedicated Vitest schema tests (`src/__tests__/content.config.test.ts`).

## Consequences & Tradeoffs

- **Positive:** Guarantees zero-cost build-time type safety for all site content and feature toggles; prevents runtime undefined errors; eliminates third-party feature flag SaaS dependencies.
- **Negative / Risks:** Updating a feature flag value requires a static site build and deployment step rather than instant remote flag toggling.
- **Adoption Readiness:** Fully active and operational across the codebase.

## Directives for AI Agents

- **Do:** Define all content collections and schema modifications inside `src/content.config.ts` using Astro Zod schemas.
- **Do:** Include explicit default values (`z.boolean().default(false)`) for boolean feature flag fields in Zod schemas.
- **Do:** Run `npm run check` and `npm run test` to verify content collection schema integrity after schema edits.
- **Don't:** Bypass Astro Content Collections to manually import or parse raw Markdown/JSON files outside schema validation.
- **Don't:** Introduce third-party remote feature flag vendor SDKs or runtime SaaS dependencies.
