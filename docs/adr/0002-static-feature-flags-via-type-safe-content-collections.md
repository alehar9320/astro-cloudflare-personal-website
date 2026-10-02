# 0002. Static Feature Flags via Type-Safe Content Collections

- **Status:** Accepted
- **Date:** 2026-10-02
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

Experimental features, visual micro-interactions, tactile feedback toggles, and WIP components in this portfolio need to be gated cleanly without incurring external runtime API overhead or client-side latency. Additionally, AI agents working on independent feature tracks need a deterministic, type-safe mechanism to declare and inspect feature flags without introducing runtime runtime failures or unvalidated configuration files.

## Decision

All feature flags across the repository MUST be defined as static JSON key-value pairs in `src/content/flags/config.json` and strictly validated using Astro Content Collections with Zod schemas in `src/content.config.ts`.

Components access feature flags at build-time or SSR hydration time via Astro's `getEntry('flags', 'config')` content collection loader.

## Consequences & Tradeoffs

- **Positive:**
  - Zero external API calls or network latency for flag evaluation at edge runtime.
  - Compile-time type safety via Astro's generated content collection types and Zod schema validation.
  - AI agents can easily inspect, enable, or disable feature flags in `src/content/flags/config.json`.
- **Negative / Risks:**
  - Flag changes require a build or deployment step (static build-time / static collection evaluation).
  - `config.json` must be kept in sync with the Zod schema in `src/content.config.ts`.
- **Adoption Readiness:** Already actively adopted across multiple components and agent tracks (`Jules`, `Apex`, `Kinetic`).

## Directives for AI Agents

- **Do:**
  - Add new feature flag definitions to the Zod schema in `src/content.config.ts` when adding new flags to `src/content/flags/config.json`.
  - Retrieve feature flags using `getEntry('flags', 'config')` from `astro:content`.
  - Gate experimental features or micro-interactions behind explicit boolean flag checks.
- **Don't:**
  - Hardcode ad-hoc environment variables or unvalidated local JSON files for feature flags.
  - Bypass Zod schema validation when declaring new feature flag keys in `config.json`.
  - Access flags directly via untyped file reads or dynamic `fs` imports.
