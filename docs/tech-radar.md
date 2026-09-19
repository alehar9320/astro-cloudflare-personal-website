# Repository Tech Radar

Welcome to the Tech Radar for the Alexander Härenstam Personal Website repository (`astro-cloudflare-personal-website`). This document tracks technology choices, architectural patterns, and engineering workflows evaluated and adopted across the codebase.

---

## Structure & Definitions

### Quadrants

1. **Frameworks & Runtimes:** Core application frameworks, language runtimes, and adapter environments.
2. **Infrastructure & Cloud:** Edge hosting, hosting environments, CI/CD pipelines, and runtime storage.
3. **Tooling & AI Workflows:** Developer tooling, linter/formatter configurations, test runners, and autonomous AI agent workflows.
4. **Patterns & Architecture:** Structural conventions, CSS design systems, data validation rules, and runtime patterns.

### Rings

- **Adopt:** High confidence, production-proven in this repository. Default choice for all new features and updates.
- **Trial:** High potential with low risk. Proven in isolated test environments, experimental routes, or specific helper utilities.
- **Assess:** Under evaluation for architectural fit, trade-offs, and maintenance cost. Not recommended for active production code without prior ADR.
- **Hold:** Phased out, anti-patterns, or explicitly banned in this setup. Do not use for new work.

---

## 1. Frameworks & Runtimes

| Ring       | Technology / Tool                                | Context & Usage                                                                              |
| :--------- | :----------------------------------------------- | :------------------------------------------------------------------------------------------- |
| **Adopt**  | **Astro 5.x**                                    | Primary web framework for fast SSG/SSR content delivery and island component rendering.      |
| **Adopt**  | **Cloudflare Workers (`@astrojs/cloudflare`)**   | Production runtime adapter for edge serverless execution and static asset serving.           |
| **Adopt**  | **TypeScript (Strict Mode)**                     | Primary development language; full type safety enforced across all components and utilities. |
| **Trial**  | **Node.js Standalone Adapter (`@astrojs/node`)** | Secondary test runtime environment on Render (`RENDER=true`) for AI agent (Jules) debugging. |
| **Assess** | **Cloudflare Workflows / Durable Objects**       | Potential stateful edge services if dynamic interactive backends expand.                     |
| **Hold**   | **Heavy JS UI Frameworks (React, Vue, Svelte)**  | Banned for core pages to preserve minimalist bundle size and zero-JS client default.         |

---

## 2. Infrastructure & Cloud

| Ring       | Technology / Tool                        | Context & Usage                                                                                        |
| :--------- | :--------------------------------------- | :----------------------------------------------------------------------------------------------------- |
| **Adopt**  | **Cloudflare Workers + Assets**          | Primary production hosting environment deployed via `wrangler.jsonc` and Git integration.              |
| **Adopt**  | **GitHub Actions**                       | Automated CI pipeline (`ci.yml`) enforcing format checks, linting, unit tests, and build verification. |
| **Trial**  | **Render Blueprint (`render.yaml`)**     | Secondary Node web service Blueprint used specifically as a test sandbox for Jules agent debugging.    |
| **Assess** | **Cloudflare KV / D1**                   | Edge storage bindings available for future dynamic persistence needs.                                  |
| **Hold**   | **Traditional Monolithic / VPS Hosting** | Anti-goal; repository is architected exclusively for edge serverless and static asset delivery.        |

---

## 3. Tooling & AI Workflows

| Ring       | Technology / Tool                    | Context & Usage                                                                                          |
| :--------- | :----------------------------------- | :------------------------------------------------------------------------------------------------------- |
| **Adopt**  | **Vitest (`vitest`)**                | Fast unit testing runner used for all utility, component, and route tests.                               |
| **Adopt**  | **Prettier & ESLint**                | Standardized code formatting (`prettier-plugin-astro`) and linting (`eslint-plugin-astro`).              |
| **Adopt**  | **Husky & Lint-Staged**              | Pre-commit Git hooks ensuring code style compliance before committing.                                   |
| **Adopt**  | **Autonomous AI Agent Fleet**        | Structured AI roles (Archie, Sentinel, Vantage, Bolt, Jules, etc.) governing repo quality and evolution. |
| **Trial**  | **Sentry Astro / Cloudflare SDKs**   | Error tracking and telemetry integration (`@sentry/astro`, `@sentry/cloudflare`).                        |
| **Trial**  | **Codecov (`@codecov/vite-plugin`)** | Automated coverage analysis and reporting integrated with CI pipeline.                                   |
| **Assess** | **Model Context Protocol (MCP)**     | Tooling protocol for enhancing AI agent context awareness and external integrations.                     |
| **Hold**   | **pnpm / yarn**                      | Repository strictly mandates `npm` as the sole package manager to ensure lockfile deterministic builds.  |

---

## 4. Patterns & Architecture

| Ring       | Technology / Tool                            | Context & Usage                                                                                                      |
| :--------- | :------------------------------------------- | :------------------------------------------------------------------------------------------------------------------- |
| **Adopt**  | **Static-First Hybrid Rendering**            | Default to pre-rendered HTML pages with opt-in edge SSR handlers where dynamic response is required.                 |
| **Adopt**  | **Vanilla CSS "Northern Lights" Theme**      | Micro-designed glassmorphic UI using marine blue & cyan gradients without external CSS libraries.                    |
| **Adopt**  | **Strict Schema Validation via Zod**         | All content collections and static feature flag definitions MUST pass strict Zod schemas (`src/content.config.ts`).  |
| **Adopt**  | **Feature Flag Isolation**                   | Experimental features and UI enhancements must be gated behind feature flags (`src/content/flags/config.json`).      |
| **Trial**  | **Canvas / WebGL Micro-Interactions**        | Self-contained, teardown-managed canvas elements in `/lab/` or interactive islands with `astro:before-swap` cleanup. |
| **Assess** | **Single-Pass Array Traversal for Edge SSR** | Micro-optimization pattern replacing array chain allocations with single `for...of` or indexed loops on Workers.     |
| **Hold**   | **Tailwind CSS / CSS Frameworks**            | Anti-goal; external utility CSS frameworks are prohibited in favor of scoped Vanilla CSS.                            |
| **Hold**   | **Raw `set:html` Directives**                | Banned unless input content is 100% trusted or sanitized to eliminate XSS risks.                                     |
