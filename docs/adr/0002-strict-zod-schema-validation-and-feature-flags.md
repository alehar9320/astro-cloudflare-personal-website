# 0002. Strict Zod Schema Validation for Content Collections and Feature Flags

- **Status:** Accepted
- **Date:** 2026-08-24
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

The repository relies on Astro Content Collections (`src/content.config.ts`) to manage portfolio content (e.g. work experience, publications) and runtime feature flags (`src/content/flags/config.json`). To prevent runtime errors, maintain strict TypeScript safety, and ensure autonomous AI agents do not introduce invalid or untyped content structures, all data schemas must be strictly defined and validated at build time.

## Decision

All content collections and feature flags **MUST** be defined using Astro Content Collections (`defineCollection`) and validated strictly with Zod schemas (`import { z } from 'astro/zod'`) inside `src/content.config.ts`. Unchecked, dynamically-typed, or raw unvalidated JSON imports are strictly prohibited across all application routes and components.

## Consequences & Tradeoffs

- **Positive:**
  - Build-time static validation catches invalid content structures, missing fields, and type mismatches before deployment.
  - Provides auto-generated TypeScript type definitions for all content entries and feature flags across the codebase.
  - Guarantees zero-dependency runtime overhead since Zod schemas are evaluated during Astro's content compilation build step.
- **Negative / Risks:**
  - Adding new feature flags or content properties requires updating `src/content.config.ts` in addition to JSON/Markdown source files.
  - Schema shifts require `npx astro sync` or build verification to update generated types.
- **Adoption Readiness:** Fully implemented and active in `src/content.config.ts` across `work` and `flags` collections.

## Directives for AI Agents

- **Do:**
  - Pass all new content collection types or feature flags through Zod schemas in `src/content.config.ts`.
  - Use Astro's `getCollection` or `getEntry` APIs to query content collections and feature flags safely.
  - Enforce default fallback values in Zod schemas for optional boolean feature flags (e.g., `z.boolean().default(false)`).
- **Don't:**
  - **NEVER** import JSON files directly using raw `import data from '...'` when representing content or feature flags.
  - **NEVER** use `any` or `@ts-ignore` to bypass Zod schema validation errors.
  - **NEVER** bypass schema definitions by creating unvalidated dynamic content loaders outside `src/content.config.ts`.
