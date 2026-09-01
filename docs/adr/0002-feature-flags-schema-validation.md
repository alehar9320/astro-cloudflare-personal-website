# 0002. Feature Flags Schema Validation & Decoupled Configuration

- **Status:** Accepted
- **Date:** 2026-09-01
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

The repository contains multiple autonomous AI agents (such as Apex, Kinetic, Aurora, and Jules) shipping isolated micro-features and UI experiments. To isolate experimental features without modifying global routing, runtime layout logic, or incurring runtime build breaks, feature toggles are stored in `src/content/flags/config.json`.

However, modifying or adding feature toggles in `config.json` without updating Content Collections validation schemas breaks content schema unit tests and type inference.

## Decision

All runtime feature flags must be declared centrally in `src/content/flags/config.json` and synchronized with the Zod schema in `src/content.config.ts`.

Feature flags must follow standard boolean property defaults (e.g., `z.boolean().default(false)`).

## Consequences & Tradeoffs

- **Positive:** Ensures strict type safety, prevents runtime undefined flag access, and enables safe experimental isolation for all autonomous agents.
- **Negative / Risks:** Developers and AI agents must update two files (`config.json` and `src/content.config.ts`) when adding new flags.
- **Adoption Readiness:** Pattern is already fully operational in `src/content/flags/` and `src/content.config.ts`.

## Directives for AI Agents

- **Do:**
  - Define new feature flags in `src/content/flags/config.json`.
  - Synchronize any new feature flag with `src/content.config.ts` under the `flags` collection schema using `z.boolean().default(false)`.
  - Use feature flags to isolate experimental routes, micro-interactions, or visual enhancements.
- **Don't:**
  - Never add a flag to `config.json` without adding its Zod schema definition to `src/content.config.ts`.
  - Never remove existing feature flags without checking component references across `src/`.
