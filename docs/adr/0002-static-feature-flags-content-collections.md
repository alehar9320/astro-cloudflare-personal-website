# 0002. Static Feature Flags via Type-Safe Content Collections

- **Status:** Accepted
- **Date:** 2026-03-30
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

Autonomous agents (such as Apex, Jules, and Aurora) and human developers continuously build experimental UI micro-interactions, new components, and temporary routes. Introducing non-validated runtime flags or third-party feature flag services adds unnecessary runtime latency, external network dependencies, and complexity to an otherwise lightweight edge-hosted static/SSR site.

## Decision

Feature flags MUST be defined statically in JSON format within `src/content/flags/config.json` and strictly validated using Zod schemas inside Astro Content Collections (`src/content.config.ts`). Accessing feature flags in pages or components is done via Astro Content Collections querying (`getCollection('flags')` or `getEntry('flags', 'config')`).

## Consequences & Tradeoffs

- **Positive:** Zero external runtime dependencies, 100% type-safe flag definitions verified at build time via `astro check`, zero runtime overhead at the edge, and zero secret exposure risk.
- **Negative / Risks:** Toggling a flag requires a code change and site rebuild rather than a real-time dynamic backend toggle.
- **Adoption Readiness:** Already fully implemented and used across active feature flags in `src/content/flags/config.json` and schema definitions in `src/content.config.ts`.

## Directives for AI Agents

- **Do:** Register all new feature flags in `src/content/flags/config.json` AND update the Zod schema in `src/content.config.ts`.
- **Do:** Use Astro Content Collections (`getEntry` / `getCollection`) to read feature flags within `.astro` components or scripts.
- **Don't:** Import third-party feature flag SDKs or inject unvalidated global variables for feature gating.
- **Don't:** Remove existing feature flags without verifying no active components or experimental routes depend on them.
