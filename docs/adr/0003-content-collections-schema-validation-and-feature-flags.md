# 0003. Content Collections Schema Validation and Static Feature Flags

- **Status:** Accepted
- **Date:** 2026-10-18
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

As the personal portfolio evolves through autonomous agent workflows and manual updates, type safety and validation of static content (work experience markdown, case studies) and site feature flags are required to prevent runtime crashes, missing fields, or broken layouts.

## Decision

- Enforce strict type validation for content collections (`work`, `flags`) using Astro Content Collections with Zod schemas defined centrally in `src/content.config.ts`.
- Store feature flags as static JSON objects under `src/content/flags/` loaded via glob loader.
- Require explicit boolean defaults with fallbacks (`z.boolean().default(false)`) for all feature flag toggles to ensure safe behavior when flags are unconfigured or added during incremental rollouts.
- Enforce `metaDescription` constraints (min 1, max 160 characters) on work collection items for SEO and social sharing safety.

## Consequences & Tradeoffs

- **Positive:** Catch schema discrepancies and missing content attributes at build/type-check time (`astro check` / `vitest`), preventing runtime errors in production.
- **Negative / Risks:** Modifying frontmatter or flag structures requires updating `src/content.config.ts` and associated unit tests in `src/__tests__/content.config.test.ts`.
- **Adoption Readiness:** Fully active and integrated across content loading pipelines and feature flag helpers.

## Directives for AI Agents

- **Do:** Define content collection schemas centrally in `src/content.config.ts` using Astro `defineCollection` and Zod schemas.
- **Do:** Ensure all boolean feature flag entries in `flags` schema define explicit safe fallbacks with `.default(false)`.
- **Do:** Verify content collection schema compliance by running `npm run test` and `npm run astro check`.
- **Don't:** Bypass schema validation using `any`, `@ts-ignore`, or unvalidated JSON parses for content collections or feature flag files.
- **Don't:** Add third-party feature flag SDKs or dynamic external flag services; feature flags must remain static content collections.
