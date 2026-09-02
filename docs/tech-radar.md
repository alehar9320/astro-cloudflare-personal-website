# Repository Tech Radar

The Tech Radar documents technology choices, structural patterns, and tool trajectories for the Personal Portfolio repository. It provides explicit ground-truth context for human developers and autonomous AI agents.

## Quadrants & Rings Overview

### Rings

- **Adopt:** High confidence, production-proven in this repository. Default choice for all new work.
- **Trial:** High potential with low risk. Ready for isolated usage in experimental routes, minor features, or scripts.
- **Assess:** Worth tracking and evaluating trade-offs; not yet recommended for active production code.
- **Hold:** Phasing out, banned, or proven problematic in our setup. Do not use for new work.

---

## 1. Frameworks & Runtimes

- **Adopt:**
  - **Astro (v4+ / v7):** Primary web framework for static-first, content-focused architecture.
  - **TypeScript (Strict Mode):** Mandatory type system across all application code, utilities, and tests.
  - **Node.js (>=22.12.0):** Baseline local development and build runtime.
- **Trial:**
  - **`@astrojs/node` Standalone Adapter:** Used exclusively for the Render Jules test environment (`RENDER=true`).
- **Assess:**
  - **WebAssembly (Wasm):** Edge compute compilation target for potential high-performance data processing.
- **Hold:**
  - **Client-Side Framework Hydration (`client:load`, `client:only` with React/Vue/Svelte):** Avoid client JS overhead; prefer static HTML/CSS and minimal vanilla JS islands.

---

## 2. Infrastructure & Cloud

- **Adopt:**
  - **Cloudflare Workers + Assets:** Production deployment model (`wrangler.jsonc`).
  - **Sentry Astro / Cloudflare Integrations:** Telemetry, error logging, and performance monitoring.
- **Trial:**
  - **Render Web Service Blueprint:** Dedicated sandbox environment for AI agent testing.
- **Assess:**
  - **Cloudflare Workers AI / Vectorize:** Edge LLM execution and vector database capabilities.
- **Hold:**
  - **Legacy Cloudflare Pages:** Superseded by the unified Cloudflare Workers + Assets binding model.

---

## 3. Tooling & AI Workflows

- **Adopt:**
  - **Vitest:** Primary testing framework for unit, parser, and schema validation tests.
  - **Prettier + Prettier Plugin Astro:** Mandatory repository formatting engine.
  - **ESLint (Flat Config):** Strict code linting and style enforcement.
  - **Autonomous AI Agent Ecosystem:** Autonomous feature, performance, quality, design, and architecture agents operating via `.Jules/` journals and feature flag isolation.
- **Trial:**
  - **Codecov Vite Plugin:** Bundle analysis and test coverage tracking.
- **Assess:**
  - **Model Context Protocol (MCP) Servers:** Standardized documentation and context retrieval (`mcp_config.json`).
- **Hold:**
  - **Manual CI Production Deployments:** Production releases are handled exclusively by Cloudflare's Git integration on `main`.

---

## 4. Patterns & Architecture

- **Adopt:**
  - **Static Pre-Rendering (`output: 'static'`):** High-performance static HTML generation.
  - **Zero-Dependency Vanilla CSS:** 'Northern Lights' design system with custom properties and frosted-glass effects.
  - **Type-Safe Zod Schemas:** Compile-time and runtime validation for content collections and feature flags (`src/content.config.ts`).
  - **Feature Flag & Experimental Route Isolation:** Guarding WIP changes via `src/content/flags/config.json` and `src/pages/experimental/`.
  - **Zero-Allocation SSE Stream Parsing:** Pointer-based string traversal for Cloudflare Worker stream processing (`src/utils/chat-stream.ts`).
- **Trial:**
  - **High Contrast / Forced-Colors Support:** `@media (forced-colors: active)` system color fallbacks.
- **Assess:**
  - **Canvas & WebGL Animation Loops:** Interactive visuals bound to Astro lifecycle teardown (`astro:before-swap`).
- **Hold:**
  - **Tailwind CSS & Utility Frameworks:** Prohibited; maintain strict Vanilla CSS adherence.
  - **Bypassing Type Safety (`@ts-ignore` / `any`):** Strictly forbidden across all code and tests.
