# Repository Tech Radar

## Overview

The Repository Tech Radar tracks technology choices, frameworks, infrastructure bindings, development tools, and architectural patterns used across Alexander Härenstam's personal portfolio repository.

## Quadrants

### 1. Frameworks & Runtimes

- **Adopt:**
  - **Astro:** Core static site generator and server endpoint framework (`output: 'static'`).
  - **Cloudflare Workers:** Edge runtime host (`@astrojs/cloudflare`) executing static asset delivery and server endpoints.
  - **TypeScript:** Strict type checking across the entire application and utility scripts (`tsconfig.json`).
  - **Node.js (>=22.12.0):** Standard build engine and local script execution environment.
- **Trial:**
  - **Experimental Lab Routes (`src/pages/lab/`):** Isolated routes for testing creative canvas/WebGL micro-interactions without impacting main portfolio pages.
- **Assess:**
  - **HTML5 Canvas / WebGPU Renderers:** Pure TypeScript math/physics canvas utilities for lightweight interactive visual effects.
- **Hold:**
  - **@astrojs/node for Production:** Node standalone adapter is strictly reserved for the Render test environment (`render.yaml`); never use for production deployment.
  - **Heavy UI Framework Adapters (React, Vue, Svelte):** Keep component tree in native Astro and scoped CSS to preserve minimal bundle size.

### 2. Infrastructure & Cloud

- **Adopt:**
  - **Cloudflare Workers + Assets Binding (`env.ASSETS`):** Primary production deployment infrastructure serving static assets and handling dynamic edge requests.
  - **Cloudflare Workers AI / KV Bindings:** Edge key-value storage and AI model invocation bindings configured in `wrangler.jsonc`.
- **Trial:**
  - **Render Debug Environment:** Secondary Node server environment exclusively used by Google Jules for test execution.
- **Assess:**
  - **Cloudflare D1 / Vectorize:** Potential edge relational or vector storage for semantic content search.
- **Hold:**
  - **Alternative Cloud Providers (AWS / Vercel / Netlify):** Cloudflare Workers is the single source of truth for production deployment.
  - **External Database SaaS:** Avoid third-party remote database dependencies that introduce latency and complexity.

### 3. Tooling & AI Workflows

- **Adopt:**
  - **Vitest:** Unit testing framework for utility functions, API routes, and schema validation.
  - **ESLint & Prettier:** Code quality, formatting, and Astro syntax enforcement (`prettier-plugin-astro`).
  - **Wrangler:** Cloudflare Workers development and type generation tool (`wrangler types`).
  - **Husky & lint-staged:** Git hook automation enforcing formatting and lint checks on pre-commit.
  - **PostHog & Sentry:** Privacy-conscious client telemetry and edge error tracking (`@sentry/cloudflare`, `@sentry/astro`).
- **Trial:**
  - **Autonomous AI Agent Workflows:** Domain-specific AI agents (`Archie`, `Bolt`, `Janitor`, `Sentinel`, `Kinetic`, `Apex`, `Engine`, `Prism`, `Palette`, `Docu`, `Aurora`, `ObservabilityClerk`).
- **Assess:**
  - **Model Context Protocol (MCP):** MCP servers for local AI agent tool augmentation (`mcp_config.json`).
- **Hold:**
  - **Tailwind CSS & CSS Frameworks:** Banned. Use Vanilla CSS with scoped Astro styles and CSS custom properties.
  - **Heavy JS Animation Frameworks (GSAP, Framer Motion):** Banned. Use hardware-accelerated CSS keyframes and transitions.

### 4. Patterns & Architecture

- **Adopt:**
  - **Static Pre-Rendering (`output: 'static'`):** Default build configuration producing static HTML with edge server endpoints (`src/pages/api/`).
  - **Astro Content Collections + Zod Schema Validation:** Strictly typed frontmatter validation (`src/content.config.ts`).
  - **Static Feature Flags:** Local JSON flag toggles stored in `src/content/flags/` with explicit Zod fallback defaults.
  - **Hardware-Accelerated CSS Micro-Interactions:** Smooth `transform` and `opacity` transitions gated by `@media (prefers-reduced-motion: reduce)`.
  - **High-Contrast Forced-Colors Fallback Borders:** Explicit `border-color: CanvasText` overrides for Windows High Contrast mode.
  - **Safe JSON-LD Script Serialization:** Neutralizing `</script>` injection vectors via `<` to `\u003c` replacement.
- **Trial:**
  - **Single-Pass Greedy Regex Extraction:** Memory-efficient string and changelog parsing without array allocations.
- **Assess:**
  - **Dynamic Edge HTML Streaming:** Streaming micro-widgets for live data updates.
- **Hold:**
  - **Third-Party Remote Feature Flag SaaS:** Banned in favor of local static flag JSON collections.
  - **TypeScript Any / @ts-ignore Bypasses:** Banned. Maintain strict type safety across all files.

## Rings Summary

- **Adopt:** High confidence, production-proven in this repository. Default choice for all new development.
- **Trial:** High potential with low risk. Ready for isolated usage in minor features or debug environments.
- **Assess:** Worth tracking and evaluating trade-offs; not yet recommended for active production code.
- **Hold:** Phased out or forbidden in this setup. Do not use for new work.
