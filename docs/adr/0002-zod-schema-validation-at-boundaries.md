# 0002. Use Zod Schema Validation at System Boundaries

- **Status:** Accepted
- **Date:** 2026-09-12
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

The repository handles runtime data from multiple external sources, including Markdown content collections, client request payloads, environment variables, and third-party APIs. To maintain type safety and avoid unexpected runtime crashes or invalid state across Cloudflare Workers edge execution, a standardized boundary validation pattern is required.

## Decision

All untrusted external data entering system boundaries (Astro content collections, API routes, environment variables, and external service payloads) must be parsed and validated strictly using Zod schemas (`zod`) before processing.

## Consequences & Tradeoffs

- **Positive:** Guaranteed type safety at runtime, fail-fast behavior with descriptive validation errors, single source of truth for inferred TypeScript types (`z.infer<typeof schema>`).
- **Negative / Risks:** Slight CPU/parsing overhead during boundary validation; schema maintenance required when data shapes evolve.
- **Adoption Readiness:** Already fully implemented across `src/content.config.ts` and core API routes; codified to prevent technical debt and structural drift.

## Directives for AI Agents

- **Do:** Always validate external payloads and API responses using `.parse()` or `.safeParse()` with a Zod schema.
- **Do:** Infer TypeScript interfaces from Zod schemas (`z.infer<typeof schema>`) rather than declaring duplicate manual interfaces.
- **Don't:** Never cast untrusted external data to `any` or `@ts-ignore` schema errors.
- **Don't:** Never bypass Zod boundary checks when creating or modifying API endpoints or content collections.
