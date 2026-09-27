# 0002. Static Feature Flags via Type-Safe Content Collections

- **Status:** Accepted
- **Date:** 2026-09-27
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

Autonomous AI agents (such as Apex, Jules, and Aurora) and human contributors frequently need to gate experimental features, visual micro-interactions, or standalone experimental routes without introducing runtime external feature-flag SaaS services (LaunchDarkly, Unleash, etc.) or complex dynamic database lookups.

Because the site is deployed as a static-first edge application on Cloudflare Workers and statically pre-rendered via Astro, feature toggles must be:

1. Zero-dependency at runtime.
2. Strictly validated at build time via Zod schemas.
3. Accessible via Astro's native `astro:content` data loading mechanisms.
4. Deterministic and version-controlled alongside repository code.

## Decision

We establish static JSON feature flags managed via Astro Content Collections in `src/content/flags/config.json` and validated strictly via `src/content.config.ts`.

All experimental toggles, visual micro-interactions, or WIP routes MUST be declared in `src/content/flags/config.json` with a boolean value and backed by a explicit Zod schema property in `src/content.config.ts`.

## Consequences & Tradeoffs

- **Positive:**
  - Zero runtime latency or external network dependency for feature flag evaluation.
  - Compile-time type safety for feature flags using Astro's generated content collection types.
  - High AI-agent predictability: agents can easily read `config.json` or query flag states via content collections.
  - Simple rollout and rollback via standard git PR workflows.

- **Negative / Risks:**
  - Changing a feature flag state requires a rebuild and deployment (static configuration).
  - Dynamic user-targeted A/B testing or real-time feature flag flips without deployment are not supported.

- **Adoption Readiness:**
  - Fully implemented and active across the repository.

## Directives for AI Agents

- **Do:**
  - Always define new feature flags in `src/content/flags/config.json` with a default `false` value when introducing experimental features.
  - Always update the `flags` Zod schema in `src/content.config.ts` to include any new feature flag key.
  - Query feature flags using Astro's `getCollection('flags')` or `getEntry('flags', 'config')` in Astro components or endpoints.
- **Don't:**
  - Do NOT add external feature-flag npm dependencies or third-party SaaS SDKs.
  - Do NOT bypass Zod schema validation when adding new flag keys.
  - Do NOT hardcode experimental feature availability in component logic without a feature flag check.
