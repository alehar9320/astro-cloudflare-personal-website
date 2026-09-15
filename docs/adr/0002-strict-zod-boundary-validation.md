# 0002. Strict Zod Boundary Validation for External and Content Schemas

- **Status:** Accepted
- **Date:** 2026-08-24
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

The site processes structured data from multiple system boundaries, including Astro content collections, API endpoints, environment variables, and telemetry events. Unvalidated data entering runtime code risks runtime exceptions, type unsafety, and silent failures, especially when interacted with by automated AI agents.

## Decision

All external data boundaries—including content collection frontmatter, API request payloads, and environment configurations—must be strictly validated using Zod schemas. Compile-time types must be derived from Zod schemas using `z.infer<typeof schema>` rather than hand-written interfaces.

## Consequences & Tradeoffs

- **Positive:** Guarantees runtime type safety, fast failures at boundaries, and self-documenting data structures across human and AI development.
- **Negative / Risks:** Slight build-time and runtime overhead for schema parsing; schema maintenance when external payloads evolve.
- **Adoption Readiness:** Fully active across content collections (`src/content.config.ts`), guidelines (`docs/zod-guidelines.md`), and API endpoints.

## Directives for AI Agents

- **Do:** Define Zod schemas for all new content collections, API request bodies, and external payload handlers.
- **Do:** Derive TypeScript types using `z.infer<typeof Schema>`.
- **Don't:** Use `any` or `@ts-ignore` to bypass schema validation.
- **Don't:** Write duplicate interface definitions alongside Zod schemas; maintain a single source of truth.
