# Repository Tech Radar

The Repository Tech Radar documents the current state, forward-looking evaluations, and phased-out technologies across Alexander Härenstam's personal portfolio repository.

## Quadrants

### 1. Frameworks & Runtimes

- **Adopt:**
  - **Astro (v4+):** Static-first SSG framework providing fast page loads and minimal JavaScript overhead.
  - **Cloudflare Workers Runtime:** Edge runtime for production asset delivery and serverless API endpoints.
  - **TypeScript (Strict Mode):** Mandatory type safety across components, content config, and scripts.
  - **Vanilla CSS:** Custom properties and scoped CSS for styling without external framework dependencies.
- **Trial:**
  - **Node.js Standalone (`@astrojs/node`):** Secondary server build target strictly used in Render test container for Google Jules debugging.
- **Assess:**
  - **HTML5 Canvas / WebGL:** Native mathematical animations isolated inside `src/pages/lab/`.
- **Hold:**
  - **React / Vue / Svelte / Solid:** Banned to prevent client bundle inflation and preserve static HTML rendering.
  - **Tailwind CSS / Utility Frameworks:** Banned in favor of maintainable Vanilla CSS and CSS custom properties.

### 2. Infrastructure & Cloud

- **Adopt:**
  - **Cloudflare Workers + Assets (`wrangler.jsonc`):** Unified Workers-First asset deployment model.
  - **Cloudflare Workers KV (`CHAT_STORE`):** Edge key-value store for lightweight persistent features.
  - **Sentry (`@sentry/astro`, `@sentry/cloudflare`):** Error monitoring and performance tracing.
- **Trial:**
  - **Cloudflare Workers AI:** Edge AI binding for experimental chat features.
- **Assess:**
  - **Custom Cloudflare Pages/Workers Caching Headers:** Micro-optimizations for static asset lifetime.
- **Hold:**
  - **Legacy Cloudflare Pages Build Model:** Replaced by unified Workers + Assets architecture.
  - **Parallel Production Deploy Steps:** Deprecated; Cloudflare Git integration owns production deployments.

### 3. Tooling & AI Workflows

- **Adopt:**
  - **Vitest:** Primary fast test runner for unit, schema, and integration tests.
  - **Prettier & ESLint:** Enforced code formatting and linting.
  - **Zod:** Runtime and compile-time schema validation core.
  - **Autonomous Agent Directives:** Persona-specific directives (`.jules/`, `AGENTS.md`, `.agents/skills/`).
  - **MCP Servers (`mcp_config.json`):** Model Context Protocol tools for Astro docs and context retrieval.
- **Trial:**
  - **Playwright Python Scripts:** Headless browser visual verification and screenshot generation.
- **Assess:**
  - **Codecov Vite Plugin:** Automated bundle size analysis.
- **Hold:**
  - **CI Direct Main Pushes:** Release scripts must not write generated metadata back to protected `main`.

### 4. Patterns & Architecture

- **Adopt:**
  - **Workers-First Assets Binding:** Standardized static + worker route handling in `wrangler.jsonc`.
  - **Strict Frontmatter Schema Validation:** Zod schemas in `src/content.config.ts` validated via Vitest.
  - **Glassmorphic Design System:** 'Northern Lights' aesthetic using Vanilla CSS backdrop-filters and custom properties.
  - **Astro View Transitions Initialization:** Binding setup routines exclusively to `astro:page-load`.
  - **Feature Flags:** Schema-validated feature toggles in `src/content/flags/`.
- **Trial:**
  - **Isolated Experimental Routes:** Standalone features scoped under `src/pages/experimental/` and `src/pages/lab/`.
- **Assess:**
  - **Answer Engine Optimization (AEO / GEO):** `.tldr-box` structured summary boxes for AI agent search clarity.
- **Hold:**
  - **Client-Side Heavy Hydration (`client:load`, `client:only`):** Avoid unless interactive state cannot be rendered statically.
  - **Untyped Frontmatter / Raw Content:** Banned in favor of Zod schema validation.

## Rings Definition

- **Adopt:** High confidence, production-proven in this repo. Default choice for new work.
- **Trial:** High potential with low risk. Ready for isolated usage in minor features or scripts.
- **Assess:** Worth tracking and evaluating trade-offs; not yet recommended for active production code.
- **Hold:** Phasing out or proven problematic in our setup. Do not use for new work.
