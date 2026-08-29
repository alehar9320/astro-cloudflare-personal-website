# 0002. Strict Zod Schema Validation for Content Collections and API Boundaries

- **Status:** Accepted
- **Date:** 2026-08-24
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

The repository handles unstructured or dynamic inputs across several key system boundaries: Astro Markdown/MDX content collections, environment variable configurations, and edge API request payloads. Without explicit schema validation at runtime and build time, unvalidated input can lead to runtime exceptions (`undefined` field access), type safety erosion, and agent drift when generating content or handling API payloads.

## Decision

All external data, content collections, environment variables, and dynamic API request payloads must be strictly validated using Zod schemas at runtime and compile-time boundaries. TypeScript interfaces for data collections must be derived directly from Zod schemas using `z.infer<typeof schema>`.

## Consequences & Tradeoffs

- **Positive:** Eliminates runtime `undefined` property access errors; provides a single source of truth for application data types; prevents untyped agent drift during content generation and API refactoring.
- **Negative / Risks:** Minor build-time overhead for schema parsing; requires keeping Zod schemas synchronized when adding new content fields.
- **Adoption Readiness:** Fully adopted across Astro content collections (`src/content.config.ts`), environment handling (`src/env/`), and edge endpoints (`src/pages/api/`).

## Directives for AI Agents

- **Do:** Declare and export explicit Zod schemas in `src/content.config.ts` or endpoint modules before consuming external data or content collections.
- **Do:** Derive TypeScript types via `z.infer<typeof schema>` rather than declaring redundant manual interface declarations.
- **Do:** Use `z.ZodError['issues']` or safe guards when referencing Zod error types in tests to avoid Zod 4 deprecation warnings.
- **Don't:** Bypass schema validation using type assertions (`as MyType`), explicit `any`, or `@ts-ignore`.
- **Don't:** Parse API request bodies without using `.safeParse()` or `.parse()` at the boundary handler.
