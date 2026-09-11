# Repository Tech Radar

This document serves as the architectural ground truth for technologies, frameworks, tools, and design patterns adopted in Alexander Härenstam's personal portfolio repository. It guides both human developers and autonomous AI agents.

## Rings

- **Adopt:** Production-proven and established core standards in this repository. Default choice for all new features and components.
- **Trial:** High potential, low risk. Approved for targeted usage in non-critical components, experimental routes, or standalone scripts.
- **Assess:** Under active evaluation. Worth monitoring trade-offs; not recommended for production usage without explicit approval.
- **Hold:** Deprecated, phased out, or explicitly forbidden in this setup. Do not adopt for new work.

---

## Quadrants

### 1. Frameworks & Runtimes

- **Adopt:**
  - **Astro (v7+):** Primary web framework configured for static pre-rendering with zero client JavaScript overhead by default.
  - **TypeScript (Strict Mode):** Mandatory programming language for type safety across components, scripts, and edge logic.
  - **Cloudflare Workers Edge Runtime:** Production execution platform handling request routing, asset delivery, and edge bindings.
- **Trial:**
  - **Node.js 22+ (Standalone Server Mode):** Isolated environment adapter (`@astrojs/node`) used strictly for local testing and AI agent test server execution when `RENDER=true`.
- **Assess:**
  - **WebAssembly (WASM):** Potential candidate for high-performance edge computations or specialized rendering in future lab features.
- **Hold:**
  - **React / Vue / Svelte / Client-side JS Frameworks:** Explicitly forbidden to keep bundle size at zero and preserve optimal Lighthouse performance.

### 2. Infrastructure & Cloud

- **Adopt:**
  - **Cloudflare Workers + Assets (`wrangler.jsonc`):** Unified Workers-first deployment model providing edge static file serving and direct binding access.
  - **Cloudflare KV (`CHAT_STORE`):** Key-Value store binding used for fast edge data persistence.
- **Trial:**
  - **Cloudflare Workers AI (`AI`):** Edge-native AI model bindings for interactive chat and micro-intelligence capabilities.
  - **Render (Jules Test Env):** Isolated Node server environment dedicated to automated AI agent integration tests.
- **Assess:**
  - **Cloudflare D1 / Vectorize:** Candidates for structured relational data or vector embeddings if chat context requirements expand.
- **Hold:**
  - **Legacy Cloudflare Pages:** Superseded by Cloudflare Workers + Assets. Do not use `_routes.json` or Pages adapters.
  - **Traditional VPS / Docker Containers:** Excluded in favor of serverless edge architecture.

### 3. Tooling & AI Workflows

- **Adopt:**
  - **Vitest:** Unit and integration testing runner configured for fast execution and high code coverage.
  - **Prettier & ESLint:** Strict formatting and linting pipeline enforced before every commit.
  - **Wrangler CLI:** Tooling for Cloudflare Workers development, type generation (`wrangler types`), and local preview.
  - **Model Context Protocol (MCP) Servers:** Standardized tooling integration (`context7`, `astro-docs`, `render`).
- **Trial:**
  - **Sentry & PostHog Telemetry:** Dynamic error monitoring and analytics SDKs with deferred dynamic imports for performance.
  - **Google Jules AI Agent:** Autonomous development and maintenance agent operating within the repository.
- **Assess:**
  - **Playwright / Browser-based E2E:** E2E testing framework for visual regression and Playwright verification scripts.
- **Hold:**
  - **Tailwind CSS / CSS-in-JS Libraries:** Explicitly prohibited in favor of modular Vanilla CSS and design tokens.
  - **npm / yarn / pnpm mixed usage:** Strict lockfile and tool usage; rely on `npm` scripts as defined in `package.json`.

### 4. Patterns & Architecture

- **Adopt:**
  - **Static Pre-Rendering (`output: "static"`):** Static-first site generation ensuring zero-latency initial HTML loading.
  - **Strict Zod Boundary Validation:** Runtime validation for content collections (`src/content.config.ts`), environment variables, and API route inputs.
  - **Modular Vanilla CSS & Design Tokens:** Pure CSS with glassmorphic 'Northern Lights' tokens, responsive touch target sizing (44x44px), and `:focus-visible` accessibility states.
  - **Workers-First Custom Request Entrypoint:** `./src/cloudflare-worker.ts` as the unified edge worker handler.
- **Trial:**
  - **Feature Flags (`src/content/flags/`):** Lightweight feature toggles for isolating experimental features and lab pages (`src/pages/experimental/`).
- **Assess:**
  - **Edge Streaming API Responses:** Streaming text/JSON responses for real-time edge interactions.
- **Hold:**
  - **Direct Writes to Protected `main` Branch for Metadata:** Release tags and changelogs are managed via GitHub Actions releases without committing generated artifacts back to `main`.
  - **Global Unchecked `any` Types or `@ts-ignore`:** Banned across all code changes to maintain strict type integrity.
