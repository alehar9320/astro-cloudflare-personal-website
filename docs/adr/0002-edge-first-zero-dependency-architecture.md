# 0002. Edge-First Zero-Dependency Architecture & Single-Pass Data Transforms

- **Status:** Accepted
- **Date:** 2026-03-30
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

The personal portfolio operates on Cloudflare Workers edge runtime isolates where memory overhead, GC pauses, subrequest latency, and bundle sizes are critical performance factors. Relying on heavy external runtime utility libraries or executing multi-pass array operations (`.map()`, `.filter()`, `.slice()`, `.flatMap()`) in Edge SSR handlers creates unnecessary dynamic intermediate allocations and increases cold start latency.

## Decision

1. **Zero-Dependency Utilities:** All backend, math, data transformation, and UI helper functions must be implemented natively in pure TypeScript without adding third-party runtime dependencies.
2. **Single-Pass Edge Transforms:** Array processing in Edge SSR helpers (such as visitor changelogs, release summaries, and chat utilities) must utilize single-pass `for...of` loops or reverse-indexed `for` loops rather than chaining dynamic intermediate array allocations.
3. **Strict Schema Boundaries:** All untrusted external inputs (Markdown frontmatter, API endpoints, feature flag JSON, user payloads) must be validated using Zod schemas at system boundaries.

## Consequences & Tradeoffs

- **Positive:** Drastically minimizes Cloudflare Worker bundle size, eliminates memory allocation spikes during Edge requests, ensures sub-millisecond SSR execution, and maintains total type safety.
- **Negative / Risks:** Developers and AI agents must author bespoke native TypeScript helpers instead of pulling in utility packages (e.g., Lodash, Ramda).
- **Adoption Readiness:** Fully active across all utilities in `src/utils/` and content loaders in `src/content.config.ts`.

## Directives for AI Agents

- **Do:** Write math, string parsing, and array utilities natively in pure TypeScript.
- **Do:** Refactor multi-step array chains (`.map().filter().slice()`) in Edge SSR routines into single-pass `for...of` or indexed loops.
- **Do:** Strictly validate all external inputs with Zod schemas using `z.infer` for derived types.
- **Don't:** Introduce third-party npm runtime dependencies for utility or data processing needs.
- **Don't:** Use `@ts-ignore`, `any`, or unvalidated type assertions on external boundaries.
