# Repository Tech Radar

This Tech Radar tracks technologies, frameworks, libraries, tools, and architectural patterns used across this repository. It serves as ground truth context for human developers and autonomous AI agents.

## Quadrants

### 1. Frameworks & Runtimes

- **Adopt:**
  - **Astro (v7+)**: Static-first web framework providing zero-JS default output and component hydration islands.
  - **Cloudflare Workers & Assets**: Production edge execution runtime (`wrangler.jsonc`).
  - **TypeScript (Strict Mode)**: Mandatory static type safety across the entire codebase.
- **Trial:**
  - **Node.js Standalone (`@astrojs/node`)**: Gated behind `RENDER=true` strictly for autonomous agent testbed execution.
- **Assess:**
  - **Cloudflare D1 / KV**: Potential storage additions for dynamic features.
- **Hold:**
  - **Classic Cloudflare Pages**: Deprecated in favor of modern Workers + Assets runtime.

### 2. Infrastructure & Cloud

- **Adopt:**
  - **Cloudflare Workers + Assets (`wrangler.jsonc`)**: Production edge platform.
  - **GitHub Actions**: CI pipeline for formatting, linting, testing, and releases.
- **Trial:**
  - **Render (`render.yaml`)**: Jules autonomous testing environment.
- **Assess:**
  - **Cloudflare Vectorize**: Vector embeddings for potential semantic search.
- **Hold:**
  - **Manual Server Deployments**: All deployments must flow through git integration or automated workflows.

### 3. Tooling & AI Workflows

- **Adopt:**
  - **Vitest**: Unit testing framework with native Vite integration.
  - **ESLint & Prettier**: Static analysis and code style formatting enforcement.
  - **Jules AI Agents**: Scheduled and PR-triggered autonomous maintenance and feature agents.
- **Trial:**
  - **MCP (Model Context Protocol) Servers**: Local developer context integration via `mcp_config.json`.
- **Assess:**
  - **Playwright**: End-to-end frontend verification testing.
- **Hold:**
  - **Jest / Mocha**: Banned in favor of Vitest.

### 4. Patterns & Architecture

- **Adopt:**
  - **Workers-First Architecture**: Single Worker runtime handling assets and edge routes.
  - **Strict Zod Boundary Validation**: Schema-first runtime validation for API inputs, env vars, and content collections.
  - **Vanilla CSS Styling**: Hardware-accelerated glassmorphism without framework bloat.
- **Trial:**
  - **Dynamic Telemetry Imports**: Splitting heavy dynamic chunks for client-side analytics.
- **Assess:**
  - **WebGPU / Advanced WebGL Canvases**: High-performance interactive visual art.
- **Hold:**
  - **Tailwind CSS & Utility CSS Frameworks**: Strictly forbidden in favor of scoped Vanilla CSS.
  - **Global State Managers (Redux, Zustand)**: Banned; rely on native Web APIs, URL state, or Astro island props.

## Rings

- **Adopt:** High confidence, production-proven in this repo. Default choice for new work.
- **Trial:** High potential with low risk. Ready for isolated usage in minor features or scripts.
- **Assess:** Worth tracking and evaluating trade-offs; not yet recommended for active production code.
- **Hold:** Phasing out or proven problematic in our setup. Do not use for new work.
