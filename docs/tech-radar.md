# Repository Tech Radar

This document tracks technologies, frameworks, infrastructure patterns, and workflows used across the repository. It provides ground-truth context for human engineers and autonomous AI agents.

## Quadrants & Technology Status

### 1. Frameworks & Runtimes

- **Adopt:**
  - **Astro (v7+):** Primary static site generator and dynamic server-rendering framework.
  - **TypeScript (Strict Mode):** Mandatory language choice for type-safe application logic and data schemas.
  - **Node.js (>=22.12):** Standard runtime engine for local development, CI pipelines, and Jules test runner.
- **Trial:**
  - **Cloudflare Workers `@astrojs/cloudflare` adapter:** Edge adapter for serverless asset routing and pre-rendering.
- **Assess:**
  - **WebGPU / Native Canvas Shaders:** Evaluation for potential interactive background visuals in lab components.
- **Hold:**
  - **React / Vue / Svelte Component Frameworks:** Avoid client UI runtime frameworks; leverage static HTML + Vanilla Web Components to keep client JS minimal.

---

### 2. Infrastructure & Cloud

- **Adopt:**
  - **Cloudflare Workers + Assets:** Unified serverless deployment target for production site hosting (`wrangler.jsonc`).
  - **Sentry (`@sentry/astro`):** Client and edge runtime monitoring and error performance tracking.
- **Trial:**
  - **Render Node Standalone Server (`render.yaml`):** Isolated testing environment for Google Jules debugging (see [ADR 0001](adr/0001-cloudflare-production-render-jules.md)).
- **Assess:**
  - **Cloudflare Vectorize / AI Workers:** Potential future integration for local semantic RAG queries.
- **Hold:**
  - **Deprecated Cloudflare Pages Direct Uploads:** Replaced by unified Workers-First model (`wrangler.jsonc`).
  - **Parallel Manual Production CI Deploys:** Cloudflare Git integration owns production deployments on `main`.

---

### 3. Tooling & AI Workflows

- **Adopt:**
  - **Vitest:** Primary Unit & Integration testing suite.
  - **ESLint & Prettier:** Mandatory code formatting and static analysis rules.
  - **Husky & lint-staged:** Pre-commit hooks for automated formatting and linting verification.
  - **Jules & Autonomous Agent Suite (Archie, Kinetic, Stratus, Palette, Sentinel, Engine, etc.):** Autonomous agent ecosystem.
  - **MCP Servers (`mcp_config.json`):** Model Context Protocol integrations for local documentation and tooling.
- **Trial:**
  - **Playwright (Python/Node):** Visual verification screenshotting and E2E smoke tests.
- **Assess:**
  - **Codecov Bundle Analysis:** Tracking bundle sizes and coverage metrics in PR workflows.
- **Hold:**
  - **Commit-time Writes to Protected Main Branch:** Release scripts must create GitHub releases rather than committing version tags directly back to `main`.

---

### 4. Patterns & Architecture

- **Adopt:**
  - **Static-First Pre-rendering:** Pre-render pages to static HTML by default (`output: "static"`).
  - **Zod Boundary Validation:** Validate all external content collections, environment variables, and API payloads via Zod schemas (see [ADR 0002](adr/0002-strict-zod-schema-validation.md)).
  - **Vanilla CSS Glassmorphism:** Scoped CSS with custom properties ('Northern Lights' aesthetic); no CSS utility frameworks.
  - **Workers-First Binding Pattern:** Uniform environment variable binding and asset routing via `wrangler.jsonc`.
- **Trial:**
  - **Astro View Transitions (`astro:page-load`):** Smooth client navigation with strict initialization event handler listener patterns.
- **Assess:**
  - **Edge Caching Header Customization:** Micro-optimizations for static asset edge cache TTL.
- **Hold:**
  - **Tailwind CSS / CSS Frameworks:** Banned. Use Vanilla scoped CSS only.
  - **Any / `@ts-ignore` Type Bypasses:** Banned. All code must pass strict TypeScript checks.

---

## Ring Definitions

- **Adopt:** High confidence, production-proven in this repository. Default choice for new work.
- **Trial:** High potential with low risk. Ready for isolated usage in minor features or experimental routes.
- **Assess:** Worth tracking and evaluating trade-offs; not yet recommended for active production code.
- **Hold:** Phasing out or proven problematic in our setup. Banned for new work.
