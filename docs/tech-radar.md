# Repository Tech Radar

This document maintains the ground-truth technology status across 4 rings (**Adopt**, **Trial**, **Assess**, **Hold**) and 4 operational quadrants for Alexander Härenstam's personal portfolio repository.

## Quadrants & Technology Entries

### 1. Frameworks & Runtimes

- **Adopt:**
  - **Astro (v4+ / v7+):** Core web framework driving static site generation, content collections, and component rendering.
  - **Cloudflare Workers Runtime:** Native edge execution environment for dynamic API endpoints and asset delivery.
  - **TypeScript (Strict Mode):** Type-safe development standard across all src components, APIs, and scripts.
- **Trial:**
  - **Node.js (@astrojs/node):** Standalone server adapter used strictly as an isolated test environment on Render (`RENDER=true`).
- **Assess:**
  - **WebGPU / Advanced Canvas:** Safe-space experimental interactive elements in `/src/pages/lab/`.
- **Hold:**
  - **React / Vue / Heavy Client Frameworks:** Avoid introducing external UI client frameworks; leverage Astro Astro-native components and Vanilla JS.

### 2. Infrastructure & Cloud

- **Adopt:**
  - **Cloudflare Workers + Assets (`wrangler.jsonc`):** Unified Workers-First edge deployment model.
  - **Cloudflare KV & Workers AI:** Native bindings for edge state management and AI streaming interfaces.
  - **Sentry & PostHog:** Edge-compatible telemetry and monitoring integrations.
- **Trial:**
  - **Render.com:** Automated test execution environment for AI agents (Google Jules).
- **Assess:**
  - **Cloudflare D1 / Vectorize:** Potential edge database or vector search for enhanced semantic context.
- **Hold:**
  - **Legacy Cloudflare Pages:** Deprecated deployment model replaced by the Workers-First architecture.

### 3. Tooling & AI Workflows

- **Adopt:**
  - **Vitest (`@vitest/coverage-v8`):** Native unit testing runner for utilities, schemas, and API handlers.
  - **Prettier (`prettier-plugin-astro`) & ESLint:** Code style formatting and static analysis rules.
  - **Wrangler CLI (v4):** Deployment, type generation, and local binding emulation.
  - **Autonomous AI Agents (Jules, Archie, Vantage, Palette, Kinetic, Engine):** Specialized AI roles governing distinct repo domains via agent directives.
- **Trial:**
  - **Playwright (Python/Node):** Visual verification and E2E testing scripts.
- **Assess:**
  - **MCP (Model Context Protocol) Servers:** Context7 and local documentation servers (`docs/mcp.md`).
- **Hold:**
  - **Manual Deployment Scripts / Unformatted Git Pushes:** Direct manual releases without CI/CD verification pipeline.

### 4. Patterns & Architecture

- **Adopt:**
  - **Static Pre-Rendering with Edge API Fallbacks:** `output: "static"` default with edge API handlers (`src/cloudflare-worker.ts`).
  - **Strict Zod Schema Validation:** Compile-time and runtime validation for content collections and API payloads (`src/content/config.ts`).
  - **Vanilla CSS & Glassmorphic Design System:** Zero-framework CSS architecture adhering to WCAG 2.1 AA accessibility standards.
  - **Single-Pass Stream / String Parsing:** High-performance, low-allocation string processing for edge Workers.
- **Trial:**
  - **Feature Flags (`src/content/flags/config.json`):** Isolated activation for experimental routes and micro-interactions.
- **Assess:**
  - **Edge Vector / Context RAG Pipelines:** Dynamic retrieval for chat assistant endpoints.
- **Hold:**
  - **Tailwind CSS / Utility CSS Frameworks:** Banned in favor of maintainable Vanilla CSS tokens.
  - **Global Mutable State Libraries (Redux, Zustand):** Unnecessary for static-first edge architecture.

## Rings Definition

- **Adopt:** High confidence, production-proven in this repo. Default choice for new work.
- **Trial:** High potential with low risk. Ready for isolated usage in minor features or scripts.
- **Assess:** Worth tracking and evaluating trade-offs; not yet recommended for active production code.
- **Hold:** Phasing out or proven problematic in our setup. Do not use for new work.
