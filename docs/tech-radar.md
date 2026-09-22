# Repository Tech Radar

The Tech Radar tracks the technology stack, operational patterns, and engineering tooling used across this repository. It provides ground-truth context for human developers and autonomous AI agents.

## Quadrants

1. **Frameworks & Runtimes** (e.g., Astro, Cloudflare Workers, TypeScript)
2. **Infrastructure & Cloud** (e.g., Cloudflare Pages/Workers, KV, Edge Storage)
3. **Tooling & AI Workflows** (e.g., Vitest, Prettier, ESLint, Jules)
4. **Patterns & Architecture** (e.g., Static Island Hydration, Edge Caching, Schema Validation)

## Rings

- **Adopt:** High confidence, production-proven in this repo. Default choice for new work.
- **Trial:** High potential with low risk. Ready for isolated usage in minor features or scripts.
- **Assess:** Worth tracking and evaluating trade-offs; not yet recommended for active production code.
- **Hold:** Phasing out or proven problematic in our setup. Do not use for new work.

---

## Radar Entries

### 1. Frameworks & Runtimes

- **Adopt:**
  - **Astro (v7)** — Primary static site generator & web framework.
  - **Cloudflare Workers Edge Runtime** — Global serverless edge runtime for production static assets and edge routes.
  - **TypeScript (v5)** — Strictly enforced type system across all code and scripts (no `any`, no `@ts-ignore`).
- **Trial:**
  - **Node.js Standalone (`@astrojs/node`)** — Auxiliary Node server configuration used exclusively for AI agent test environments (Render).
- **Assess:**
  - **Cloudflare Workflows / Durable Objects** — Stateful edge coordination for future interactive APIs.
- **Hold:**
  - **Client-Side Frameworks (React, Vue, Svelte)** — High bundle overhead and hydration cost; prohibited for UI rendering.

### 2. Infrastructure & Cloud

- **Adopt:**
  - **Cloudflare Workers & Assets** — Primary hosting infrastructure with Git-based deployment.
  - **Cloudflare KV** — Fast edge key-value storage for analytics and state snapshot caches.
- **Trial:**
  - **Render Web Service Blueprint (`render.yaml`)** — Secondary Node runtime testing sandbox for AI agents.
- **Assess:**
  - **Cloudflare D1 / Vectorize** — Edge SQL database and vector embeddings for semantic search or retrieval.
- **Hold:**
  - **Traditional VPS / Monolithic Servers** — High operational overhead and latency compared to global edge deployment.

### 3. Tooling & AI Workflows

- **Adopt:**
  - **Vitest** — Native ESM test runner for fast, isolated unit and route handler testing.
  - **Prettier & ESLint** — Automated code formatting and linting pipelines.
  - **Jules & Autonomous Specialized Agents** — Multi-agent system (Archie, Vantage, Kinetic, Bolt, StuntDouble, etc.) for continuous maintenance and optimization.
- **Trial:**
  - **Codecov Bundle Analysis** — Automated bundle size monitoring via Vite plugin.
- **Assess:**
  - **Playwright E2E Automation** — Full browser E2E test verification for visual interaction testing.
- **Hold:**
  - **Jest / Babel** — Heavy legacy testing and transformation tooling.

### 4. Patterns & Architecture

- **Adopt:**
  - **Scoped Vanilla CSS & Glassmorphism** — Zero-dependency styling with frosted-glass aesthetic ('Northern Lights' theme).
  - **Static Island Hydration & Native Web APIs** — HTML5 Canvas, passive listeners, and explicit teardown on `astro:before-swap`.
  - **Zod Schema Validation** — Runtime type safety for content collection schemas and API request boundaries.
  - **Static Feature Flags (`src/content/flags/`)** — Zero-cost flag toggles for experimental UI enhancements.
- **Trial:**
  - **Experimental Route Isolation (`src/pages/experimental/`)** — Dedicated staging routes for unreleased features.
- **Assess:**
  - **Edge Stream Processing** — Real-time streaming API responses on Cloudflare Workers.
- **Hold:**
  - **Utility CSS Frameworks (Tailwind CSS, Bootstrap)** — Adds unnecessary CSS parser overhead and utility bloat.
  - **Uncontrolled Global Client State (Redux, Zustand)** — Unnecessary state complexity for static island architectures.
