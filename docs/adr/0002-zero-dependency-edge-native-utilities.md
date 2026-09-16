# 0002. Zero-Dependency Edge-Native Utility Architecture

- **Status:** Accepted
- **Date:** 2026-03-30
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

Cloudflare Workers edge runtimes operate under strict isolate memory bounds, sub-millisecond cold start latency expectations, and lightweight CPU limits. Introducing external NPM dependencies for simple array manipulations, string formatting, date slicing, or math calculations bloats worker bundle sizes, increases garbage collection pressure, and raises potential security vulnerability surfaces.

## Decision

All utility functions, string/date parsers, math/physics helpers, and data transformers under `src/utils/` must be implemented in native pure TypeScript without external runtime dependencies.

Edge utilities must prioritize zero-allocation algorithms (e.g., pointer scanning, in-place loops, direct slice/indexing operations, and module-level static RegExp hoisting).

## Consequences & Tradeoffs

- **Positive:** Sub-millisecond cold-start times, minimal worker bundle overhead, zero vulnerability risk from third-party utility sub-dependencies, and complete cross-runtime portability between Cloudflare Workers edge runtime, Node.js, and browser environments.
- **Negative / Risks:** Requires custom internal implementation for utilities that might otherwise be available in heavy libraries (e.g., `lodash` or `moment.js`), necessitating unit test coverage in `src/utils/` or `__tests__/`.
- **Adoption Readiness:** Currently established across all active edge helper modules in `src/utils/`.

## Directives for AI Agents

- **Do:** Write math, physics, string, and data transformation utilities natively in pure TypeScript.
- **Do:** Write unit tests (`*.test.ts` or `*.spec.ts`) in Vitest for every helper utility created or modified.
- **Do:** Hoist static regular expressions to module-level constants to avoid dynamic RegExp compilation on edge requests.
- **Do:** Use zero-allocation methods (e.g., `date.toISOString().slice(0, 10)` instead of `.split('T')[0]`, single-pass `for...of` loops, or indexed reverse scanning).
- **Don't:** Import external third-party utility libraries (such as `lodash`, `ramda`, `moment`, `date-fns`, or `chalk`) into runtime utility modules or edge API routes.
- **Don't:** Use dynamic `eval()` or unsanitized dynamic RegExp instantiation inside edge handlers.
