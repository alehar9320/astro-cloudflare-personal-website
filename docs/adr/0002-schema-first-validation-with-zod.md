# 0002. Schema-First Validation with Zod at Content and API Boundaries

- **Status:** Accepted
- **Date:** 2026-08-30
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

The repository handles structured Markdown content collections (`src/content/`) and API endpoint payloads (`src/pages/api/`). Untyped or runtime-unvalidated data causes unexpected layout breaks, silent failures, or edge runtime exceptions in production. Establishing a strict single source of truth for runtime data shapes and TypeScript types is necessary to ensure stability across human development and multi-agent execution.

## Decision

Adopt schema-first validation using [Zod](https://zod.dev) for all runtime data boundaries, including Astro content collections (`src/content.config.ts`), API route request payloads, environment variables, and external service payloads. All TypeScript interfaces for boundary data must be derived via `z.infer<typeof schema>`.

## Consequences & Tradeoffs

- **Positive:** Eliminates dynamic type errors at system boundaries; provides strong type inference and compile-time verification during `npm run astro check`; guarantees strict validation in unit tests.
- **Negative / Risks:** Slight overhead when declaring schemas for new content collections or API routes; requires careful handling of Zod version updates and type guard patterns in test suites.
- **Adoption Readiness:** Already widely implemented across `src/content.config.ts`, API routes, and unit tests (`src/__tests__/content.config.test.ts`).

## Directives for AI Agents

- **Do:** Declare Zod schemas before introducing or modifying data boundaries (content collections, API request/response payloads, environment configs).
- **Do:** Use `z.infer<typeof schema>` to generate TypeScript types instead of declaring parallel interfaces.
- **Do:** Perform fast validation using `.parse()` or `.safeParse()` at entry points.
- **Don't:** Bypass schema validation using `any`, `@ts-ignore`, or unsafe type assertions (`as unknown as T`).
- **Don't:** Modify Astro content schemas without updating corresponding schema validation unit tests in `src/__tests__/content.config.test.ts`.
