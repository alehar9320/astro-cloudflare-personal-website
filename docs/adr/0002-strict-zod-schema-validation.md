# 0002. Strict Zod Schema Validation for Content & Runtime Data

- **Status:** Accepted
- **Date:** 2026-08-28
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

The repository contains static content collections (`src/content/`), dynamic runtime data, feature flag configurations (`src/content/flags/`), and environment parameters. Without strict runtime and compile-time validation, subtle schema drifts or malformed content frontmatter could break production builds or cause subtle runtime errors in Cloudflare Workers edge execution.

## Decision

All content collections, feature flags, and structured domain schemas MUST be validated using Zod schemas (`src/content.config.ts` and `docs/zod-guidelines.md`). Schema validation MUST occur at build time and be backed by automated unit tests in `src/__tests__/content.config.test.ts`.

## Consequences & Tradeoffs

- **Positive:**
  - Eliminates runtime type errors across edge environments (Cloudflare Workers).
  - Enforces self-documenting schema contracts for content authors and AI agents.
  - Ensures instant feedback during local development and CI testing (`npm run test`).
- **Negative / Risks:**
  - Minor maintenance overhead when modifying or extending content collection fields.
  - Adding optional fields requires explicit schema defaults (e.g., `z.boolean().default(false)`).
- **Adoption Readiness:**
  - Fully adopted across `src/content.config.ts` and backed by existing test suites.

## Directives for AI Agents

- **Do:**
  - Define explicit Zod schemas in `src/content.config.ts` for any new content collection or structured configuration.
  - Use default values (`.default(...)`) or explicit optional markers for non-required fields.
  - Write or update unit tests in `src/__tests__/content.config.test.ts` whenever schemas are modified.
- **Don't:**
  - NEVER use `any` or `@ts-ignore` to bypass schema validation errors.
  - NEVER mutate `src/content.config.ts` schemas without updating corresponding test assertions and feature flag files.
