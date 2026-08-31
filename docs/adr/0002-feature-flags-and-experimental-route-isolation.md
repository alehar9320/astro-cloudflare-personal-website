# 0002. Feature Flags and Experimental Route Isolation

- **Status:** Accepted
- **Date:** 2026-03-31
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

Multiple autonomous AI agents continuously develop, enhance, and refactor features across the portfolio. Uncontrolled modifications to core pages or global worker logic carry high risk of visual regressions, layout shifts, or build breakages on production routes. A standardized mechanism is required to isolate experimental features, gate unverified UI components, and maintain zero-downtime stability.

## Decision

All new experimental features, micro-interactions, and visual components developed by autonomous agents MUST be isolated through one of two mechanisms:

1. **JSON Feature Flags:** Declared in `src/content/flags/config.json` and type-validated via Zod in `src/content.config.ts`.
2. **Experimental Route Isolation:** Standalone experimental pages and canvas/WebGL experiments MUST be located in dedicated laboratory/experimental route directories (`src/pages/experimental/` or `src/pages/lab/`).

Core production routes (`/`, `/work/`, `/biography/`) and global layout components (`src/layouts/PageLayout.astro`) MUST remain free from unflagged experimental logic.

## Consequences & Tradeoffs

- **Positive:** Prevents production breakages, enables non-breaking pull requests for autonomous AI agents, provides type-safe toggle capability, and insulates core routes from performance regressions.
- **Negative / Risks:** Requires minor boilerplate when declaring flags in `src/content/flags/config.json` and matching Zod schema rules in `src/content.config.ts`.
- **Adoption Readiness:** Already practiced across agent workflows; codifying this pattern formalizes repository governance and eliminates agent friction.

## Directives for AI Agents

- **Do:**
  - Declare new feature flag keys in `src/content/flags/config.json` using boolean defaults (`false`).
  - Synchronize every new flag in `src/content.config.ts` schema under the `flags` collection using `z.boolean().default(false)`.
  - Isolate experimental interactive 3D/canvas features inside `src/pages/lab/` or `src/pages/experimental/`.
  - Clean up client-side animation frame loops or event listeners on `astro:before-swap` during lifecycle teardowns.
- **Don't:**
  - NEVER introduce unflagged experimental UI logic directly into core production routes (`src/pages/index.astro`, `src/pages/work.astro`, `src/pages/biography.astro`).
  - NEVER modify global layout (`PageLayout.astro`) or worker routing without explicit feature flag isolation.
  - NEVER bypass Zod schema validation in `src/content.config.ts` when adding new flag entries.
