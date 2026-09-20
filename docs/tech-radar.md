# Repository Tech Radar

This document maintains the technology decisions, architectural choices, and library status across four operational quadrants and four confidence rings.

## Quadrants

1. **Frameworks & Runtimes**
2. **Infrastructure & Cloud**
3. **Tooling & AI Workflows**
4. **Patterns & Architecture**

---

## Rings

### Adopt

_High confidence, production-proven in this repository. Default choice for new work._

- **Frameworks & Runtimes:**
  - `Astro` (v7+) - Primary static site framework (`output: "static"`).
  - `TypeScript` - Strict type checking across the entire codebase.
  - `Node.js` (>=22.12.0) - Tooling and local execution baseline.
- **Infrastructure & Cloud:**
  - `Cloudflare Workers + Assets` - Unified edge hosting environment (`wrangler.jsonc`).
  - `Render` - Isolated Node standalone test host for agent debugging (`RENDER=true`).
- **Tooling & AI Workflows:**
  - `Vitest` - Primary unit test runner.
  - `Prettier` & `ESLint` - Automated code formatting and linting.
  - `Zod` - Single source of truth for runtime and compile-time data validation.
- **Patterns & Architecture:**
  - `Content Collections` - Type-safe Markdown and JSON content management via `src/content.config.ts`.
  - `Vanilla CSS` - Scoped, zero-runtime-cost CSS styling adhering to 'Northern Lights' aesthetic.

### Trial

_High potential with low risk. Ready for isolated usage in minor features or scripts._

- **Frameworks & Runtimes:**
  - `@sentry/astro` / `@sentry/cloudflare` - Telemetry and error tracking integration.
- **Infrastructure & Cloud:**
  - `Workers KV / Binding Stubs` - Mocking edge bindings in Node standalone test environments.
- **Tooling & AI Workflows:**
  - `MCP (Model Context Protocol)` - Agent context integration (`mcp_config.json`).
- **Patterns & Architecture:**
  - `Static Feature Flags` - Safe isolation of new experimental components via `src/content/flags/config.json`.

### Assess

_Worth tracking and evaluating trade-offs; not yet recommended for active production code._

- **Tooling & AI Workflows:**
  - `Codecov Vite Plugin` - Bundle analysis and coverage reports in CI.
- **Patterns & Architecture:**
  - `Edge Micro-Interactions` - Web API and Canvas micro-animations (`src/pages/lab/`).

### Hold

_Phasing out or proven problematic in our setup. Do not use for new work._

- **Frameworks & Runtimes:**
  - `Tailwind CSS` - Prohibited in favor of clean Vanilla CSS primitives.
- **Infrastructure & Cloud:**
  - `Legacy Cloudflare Pages` - Phased out in favor of unified Workers + Assets architecture.
- **Patterns & Architecture:**
  - `Direct Main Mutations for Releases` - CI automated release generation must not push directly to protected `main`.
