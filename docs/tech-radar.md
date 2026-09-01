# Repository Tech Radar

## Quadrants

### 1. Frameworks & Runtimes

- **Adopt:**
  - **Astro (v7.x):** Primary static site generator and SSG framework for all core pages.
  - **TypeScript:** Strict type system for all application logic and utilities.
  - **Cloudflare Workers (`@astrojs/cloudflare`):** Production rendering and edge serverless target.
- **Trial:**
  - **Node Standalone Adapter (`@astrojs/node`):** Used exclusively for Jules test debugging environment on Render.
- **Assess:**
  - **Wasm / Edge Module Extensions:** Evaluating potential client/edge compute extensions.
- **Hold:**
  - **React / Vue / Svelte Component Frameworks:** Keep site lightweight using zero-framework Vanilla JS/CSS islands.

### 2. Infrastructure & Cloud

- **Adopt:**
  - **Cloudflare Pages / Workers:** Production hosting environment (`wrangler.jsonc`).
  - **Sentry (`@sentry/astro`, `@sentry/cloudflare`):** Error logging and application performance monitoring.
- **Trial:**
  - **PostHog (`posthog-js`):** Web analytics and feature engagement tracking.
- **Assess:**
  - **Cloudflare KV / Vectorize:** Autonomous AI assistant memory context storage.
- **Hold:**
  - **Heavy Node Origin Hosting:** Production Node dynamic servers (migrated to Cloudflare edge).

### 3. Tooling & AI Workflows

- **Adopt:**
  - **Vitest:** Unit testing framework for utility functions and content validation.
  - **Prettier & ESLint:** Code formatting and static linting guardrails.
  - **Jules & Autonomous Agent Fleet:** Multi-agent autonomous workflow operating under agent-specific directives.
- **Trial:**
  - **Playwright:** End-to-end frontend visual verification.
- **Assess:**
  - **MCP (Model Context Protocol):** Standardized tools and prompts interface for AI context extensions.
- **Hold:**
  - **Manual Deployment Scripts:** Replaced by automated GitHub Actions CI/CD workflows.

### 4. Patterns & Architecture

- **Adopt:**
  - **Feature Flags via Content Collections:** Decoupled JSON toggles validated via Zod schemas (`src/content.config.ts`).
  - **Vanilla CSS Glassmorphic Styling:** Scoped CSS variables using 'Northern Lights' design language without external CSS frameworks.
  - **Explicit Image Dimensions:** `width` and `height` declared on visual assets for zero Cumulative Layout Shift (CLS=0).
- **Trial:**
  - **Pointer-Based Edge Stream Parsing:** High-performance buffer scanning in Cloudflare Worker SSE endpoints.
- **Assess:**
  - **Canvas Lab Isolation (`src/pages/lab/`):** Dedicated route sandbox for interactive 3D/canvas visual features.
- **Hold:**
  - **Tailwind CSS / CSS Utility Frameworks:** Prohibited to maintain pure CSS standard performance.

## Rings

- **Adopt:** High confidence, production-proven in this repo. Default choice for new work.
- **Trial:** High potential with low risk. Ready for isolated usage in minor features or scripts.
- **Assess:** Worth tracking and evaluating trade-offs; not yet recommended for active production code.
- **Hold:** Phasing out or proven problematic in our setup. Do not use for new work.
