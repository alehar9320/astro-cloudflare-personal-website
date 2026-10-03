# 0002. Static Feature Flags via Type-Safe Content Collections

- **Status:** Accepted
- **Date:** 2026-08-24
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

Autonomous agents (Apex, Kinetic, Aurora) and human developers introduce experimental features, visual micro-interactions, and temporary routes into the portfolio. Hardcoding flag logic or using unverified JSON/JS objects creates runtime errors and untracked code paths.

## Decision

All experimental features, visual micro-interactions, and temporary/experimental routes must be gated behind static feature flags defined in JSON files in `src/content/flags/` (e.g., `src/content/flags/config.json`) and strictly validated via Zod schema in Astro's content collection config (`src/content.config.ts`).

## Consequences & Tradeoffs

- **Positive:** Strict compile-time and build-time type validation for all feature toggles; prevents broken or missing flags from shipping to production; enables zero-runtime-overhead feature gating.
- **Negative / Risks:** Adding a new flag requires updating both the schema in `src/content.config.ts` and the JSON configuration file.
- **Adoption Readiness:** Already implemented in `src/content/flags/config.json` and validated by `flags` content collection schema in `src/content.config.ts`.

## Directives for AI Agents

- **Do:** Define all experimental feature toggles in `src/content/flags/config.json` and validate them in `src/content.config.ts`.
- **Don't:** Implement unflagged experimental UI features or bypass Zod schema validation for feature toggles.
