# Repository Tech Radar

This Tech Radar provides explicit ground-truth context on technology choices, operational patterns, and architectural boundaries for human developers and autonomous AI agents working in this repository.

---

## Quadrants & Technology Status

### 1. Frameworks & Runtimes

- **Adopt:**
  - **Astro (v4/v5)**: Static-first web framework powering page generation and component routes. Default choice for all UI components.
  - **Cloudflare Workers**: Primary production runtime serving assets and executing edge API handlers (`src/cloudflare-worker.ts`).
  - **TypeScript (Strict Mode)**: Mandatory language standard for type safety across client scripts, worker logic, and tests.
- **Trial:**
  - **@astrojs/cloudflare**: Astro adapter for Cloudflare Worker runtime builds.
- **Assess:**
  - **Cloudflare Workers AI**: Edge inference binding for LLM features and chat capabilities.
- **Hold:**
  - **@astrojs/node (Standalone Production)**: Node runtime adapter is restricted strictly to the Render test runner harness (`RENDER=true`) for AI agent debugging. Do not use for production traffic.

---

### 2. Infrastructure & Cloud

- **Adopt:**
  - **Cloudflare Workers + Assets (`wrangler.jsonc`)**: Unified Workers-First asset hosting and dynamic edge execution.
  - **Cloudflare Git Auto-Deploy**: Automated deployment pipeline triggered by direct commits to `main`.
- **Trial:**
  - **Cloudflare KV**: Edge key-value store for session/cache persistence.
- **Assess:**
  - **Cloudflare Vectorize**: Vector index database for semantic RAG / search features.
- **Hold:**
  - **Cloudflare Pages (`_routes.json` / `functions/`)**: Deprecated deployment model. All routing and asset configuration must use `wrangler.jsonc`.

---

### 3. Tooling & AI Workflows

- **Adopt:**
  - **Vitest**: Native Unit testing runner for utility modules, schemas, and API handlers.
  - **ESLint & Prettier**: Automated linting and formatting standards enforced via pre-commit hooks and CI pipelines.
  - **Zod**: Type-safe schema validation engine for content collections, API payloads, and environment variables.
  - **Autonomous AI Agents (Jules, Archie, Stratus, etc.)**: Dedicated agent roles operating under explicit scope boundaries.
- **Trial:**
  - **MCP Servers (`mcp_config.json`)**: Context enrichment servers for Astro docs, Render, and project context.
- **Assess:**
  - **Playwright**: Automated visual testing and screenshot verification runner in local sandbox environments.
- **Hold:**
  - **Tailwind CSS / Third-Party UI Frameworks**: Prohibited. All styling must use Vanilla scoped CSS conforming to the "Northern Lights" glassmorphic aesthetic.

---

### 4. Patterns & Architecture

- **Adopt:**
  - **Workers-First Static Island Hydration**: Static HTML pre-rendering with island interactivity (`client:visible` / Vanilla JS micro-interactions).
  - **Explicit Image Dimensions (CLS=0)**: Explicit `width` and `height` attributes on visual media to eliminate cumulative layout shift.
  - **Pointer-Based SSE Stream Parsing**: Fast pointer-driven string parsing for Cloudflare Worker chat streaming utilities.
- **Trial:**
  - **Feature Flags (`src/content/flags/config.json`)**: Lightweight JSON-backed feature toggles for isolating experimental features.
- **Assess:**
  - **Astro Experimental Content Layer**: Next-gen loader APIs for dynamic external data collections.
- **Hold:**
  - **Client-Side SPA Hydration (`client:load` / `client:only` without static fallback)**: Prohibited unless static HTML/CSS cannot achieve the required interaction.

---

## Rings Definition

- **Adopt:** High confidence, production-proven in this repository. Default choice for all new features and refactors.
- **Trial:** High potential with low risk. Approved for isolated usage in feature flags or experimental components.
- **Assess:** Worth tracking and evaluating trade-offs; requires explicit architectural review before production integration.
- **Hold:** Phased out or prohibited in this setup. Do not use for new work.
