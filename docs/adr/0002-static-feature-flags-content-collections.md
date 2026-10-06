# 0002. Static Feature Flags via Type-Safe Content Collections

- **Status:** Accepted
- **Date:** 2026-10-06
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

Experimental features, visual micro-interactions, and temporary UI additions require zero-overhead runtime gating without relying on external feature flag SaaS services or dynamic client-side network calls on Cloudflare Workers edge nodes.

## Decision

Feature flags are defined statically in `src/content/flags/config.json` and validated strictly via Zod schema using Astro Content Collections in `src/content.config.ts`. Components and utilities query flags statically at build/render time.

## Consequences & Tradeoffs

- **Positive:** Zero runtime network latency, 100% compile-time type safety across Astro components and scripts, zero 3rd-party dependencies or external API costs, edge-compatible deployment on Cloudflare Workers.
- **Negative / Risks:** Flag toggles require a static build and deployment cycle to take effect.
- **Adoption Readiness:** Established pattern fully integrated across existing micro-interactions and experimental feature paths (`portfolio_tactile_v1`, `enable_strategic_pulse`, `portfolio_shimmer_v1`, etc.).

## Directives for AI Agents

- **Do:** Define new feature flags in `src/content/flags/config.json` and update the Zod validation schema in `src/content.config.ts`.
- **Don't:** Introduce 3rd-party feature flag SDKs, dynamic client-side fetching for feature flags, or unvalidated runtime global environment flag checks.
