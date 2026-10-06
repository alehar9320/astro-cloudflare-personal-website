# Repository Tech Radar

This document maintains the technology landscape and architectural standards across Alexander Härenstam's personal portfolio repository.

## Quadrants

### 1. Frameworks & Runtimes

- **Adopt:**
  - **Astro (SSG / SSR Hybrid):** Primary modern static site generator and hydration layer.
  - **TypeScript:** Strict type system enforcing runtime safety across components, scripts, and content collections.
  - **Cloudflare Workers:** Edge runtime host for production static assets and edge workers (`wrangler.jsonc`).
- **Trial:**
  - **Node.js Standalone Server (`@astrojs/node`):** Isolated test server environment strictly for Google Jules automated debugging (`render.yaml`).
- **Assess:**
  - **HTML5 Canvas Animations:** Pure Vanilla JS/TS mathematical animation loops without external 3D engine overhead.
- **Hold:**
  - **React / Vue Client Frameworks:** Avoid introducing full client SPA frameworks for simple static site components.

### 2. Infrastructure & Cloud

- **Adopt:**
  - **Cloudflare Workers & Assets:** Primary edge deployment target (`me.alehar.workers.dev`).
- **Trial:**
  - **Render Web Services:** Strictly secondary non-production test/debugging environment for Jules agents (`render.yaml`).
- **Assess:**
  - **Cloudflare KV / D1:** Potential lightweight persistence options for serverless counters or micro-analytics.
- **Hold:**
  - **Traditional VPS / Monolithic Containers:** Do not deploy monolithic servers or Docker containers for static portfolio delivery.

### 3. Tooling & AI Workflows

- **Adopt:**
  - **Vitest:** Lightweight unit test runner for utility functions and content schemas.
  - **Prettier & ESLint:** Code formatting and linting standard enforced via git pre-commit hooks.
  - **Specialized Autonomous Agents (Jules, Archie, Bolt, Kinetic, Palette, Vantage, etc.):** Sub-agent execution framework with scoped mandates and strict PR boundaries.
- **Trial:**
  - **Model Context Protocol (MCP):** Custom MCP servers (`mcp_config.json`) for agent tooling integrations.
- **Assess:**
  - **Playwright:** End-to-end frontend visual regression testing scripts.
- **Hold:**
  - **Heavy 3rd-Party npm Dependencies:** Prohibited from adding unnecessary utility libraries or heavy bundle bloat.

### 4. Patterns & Architecture

- **Adopt:**
  - **Type-Safe Content Collections (Zod):** Strict schema enforcement for Markdown content, experience logs, and feature flags (`src/content.config.ts`).
  - **Static Feature Flags:** Config-driven feature toggles (`src/content/flags/config.json`).
  - **Scoped Vanilla CSS & CSS Custom Properties:** Zero-dependency, zero-framework design styling following 'Northern Lights' aesthetic.
  - **WCAG 2.1 AA 44x44px Touch Targets:** Ergonomic touch guidelines enforced for mobile navigation drawer and interactive controls.
- **Trial:**
  - **Dynamic Spatial Step Sampling:** Frame-rate optimized canvas wave sampling based on viewport width.
- **Assess:**
  - **PostHog Idle-Load Binding:** Deferred analytics initialization bound to `window.posthog`.
- **Hold:**
  - **Tailwind CSS / Atomic CSS Frameworks:** Prohibited in favor of scoped Vanilla CSS and custom design tokens.

## Rings

- **Adopt:** High confidence, production-proven in this repo. Default choice for new work.
- **Trial:** High potential with low risk. Ready for isolated usage in minor features or scripts.
- **Assess:** Worth tracking and evaluating trade-offs; not yet recommended for active production code.
- **Hold:** Phasing out or proven problematic in our setup. Do not use for new work.
