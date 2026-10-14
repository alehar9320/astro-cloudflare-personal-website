# 0003. Content Collections Schema Validation and Static Feature Flags

- **Status:** Accepted
- **Date:** 2026-10-25
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

The portfolio website uses Astro Content Collections to manage structured Markdown content (such as work case studies in `src/content/work/`) and static JSON configuration files for feature toggles (in `src/content/flags/`). Without strict schema enforcement and explicit default fallbacks, content parsing errors or missing feature flags can cause runtime crashes, unexpected component behavior, or silent architectural drift across environments.

## Decision

- Enforce strict content schema validation and feature flag declarations using Astro Content Collections with Zod schemas defined centrally in `src/content.config.ts`.
- Store feature flags as static JSON configuration files in `src/content/flags/` with explicit boolean default fallbacks (`z.boolean().default(false)`).
- Query content collections and feature flags exclusively through Astro's official `getCollection()` or `getEntry()` methods rather than unvalidated direct filesystem imports.

## Consequences & Tradeoffs

- **Positive:** Guarantees compile-time and build-time type safety for all content and feature flags across the repository. Guarantees deterministic boolean fallbacks if flag JSON keys are omitted or deleted.
- **Negative / Risks:** Modifying content structures or adding new feature flags requires updating the central Zod schema in `src/content.config.ts`.
- **Adoption Readiness:** Fully operational and active across all content loaders and feature toggle components in production.

## Directives for AI Agents

- **Do:** Define all Astro content collections and feature flag schemas centrally in `src/content.config.ts` using Zod schemas.
- **Do:** Provide explicit boolean default fallbacks (`z.boolean().default(false)`) for all feature flag properties in `src/content/flags/`.
- **Don't:** Access content collections or feature flag JSON files using raw filesystem reads or unvalidated direct imports when Astro content collection helpers (`getCollection`, `getEntry`) are applicable.
- **Don't:** Introduce dynamic third-party feature flag SDKs, remote API feature providers, or unvalidated runtime config parsers.
