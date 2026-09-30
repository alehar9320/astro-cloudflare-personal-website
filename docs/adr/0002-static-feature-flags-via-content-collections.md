# 0002. Static Feature Flags via Type-Safe Content Collections

- **Status:** Accepted
- **Date:** 2026-08-25
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

Multiple autonomous agents (e.g. Apex, Aurora, Kinetic, Jules) introduce incremental UI micro-interactions, experimental routes, and tactile UX features into Alexander Härenstam's portfolio. To prevent runtime failures, unexpected regressions, or unvetted feature bloat, the repository requires a lightweight, build-time type-safe feature flagging system without external runtime SaaS dependencies or client-side API overhead.

## Decision

We establish static feature flagging using Astro Content Collections. Feature flags are defined in `src/content/flags/config.json` and strictly validated using Zod schemas in `src/content.config.ts` under the `flags` collection. Experimental features, micro-interactions, and temporary routes MUST be gated behind these type-safe flags.

## Consequences & Tradeoffs

- **Positive:**
  - **Zero Overhead:** No external third-party SDKs, network requests, or dynamic runtime database lookups.
  - **Strict Type Safety:** Zod schemas guarantee full type parity and compile-time validation during `npm run astro check` and `npm run build`.
  - **Agent Safety:** Autonomous agents can safely isolate experimental UI features without altering core production application logic or global styles.
- **Negative / Risks:**
  - Flag state changes require site re-deployment rather than real-time dynamic runtime toggling.
  - Stale feature flags must be periodically cleaned up once features become permanent parts of the portfolio.
- **Adoption Readiness:**
  - Active codebase pattern already established in `src/content/flags/config.json` and validated by Vitest unit tests in `src/__tests__/content.config.test.ts`.

## Directives for AI Agents

- **Do:**
  - Register any new feature flag field in `src/content.config.ts` under the `flags` Zod schema with a default boolean value.
  - Define initial flag states in `src/content/flags/config.json`.
  - Gate new experimental UI enhancements, micro-interactions, or tactile feedback using `getCollection('flags')` or `getEntry('flags', 'config')`.
- **Don't:**
  - NEVER introduce external feature flagging SDKs (e.g., LaunchDarkly, Flagsmith) or dynamic API runtime lookups.
  - NEVER bypass Zod schema validation in `src/content.config.ts` or use loose `any` types for feature flags.
  - NEVER remove or rename existing flag keys without updating corresponding component guards and tests.
