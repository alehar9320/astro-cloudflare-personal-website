# Repository Tech Radar

This document maintains ground-truth technology status across four standard rings and four operational quadrants for Alexander Härenstam's personal portfolio repository.

## Quadrants & Technology Status

### 1. Frameworks & Runtimes

- **Adopt:**
  - **Astro (v7):** Core web framework using static SSG & Edge SSR adapters (`@astrojs/cloudflare`).
  - **Cloudflare Workers:** Production Edge SSR runtime for zero-cold-start delivery.
  - **TypeScript:** Strict type checking across the entire codebase.
- **Trial:**
  - **Node.js (v22+):** Used exclusively for Jules test runner / standalone Render preview environment via `@astrojs/node`.
- **Assess:**
  - **Workers AI:** Cloudflare edge LLM inference for release summarization (`@cf/meta/llama-3.1-8b-instruct-fast`).
- **Hold:**
  - **React / Vue / Svelte Heavy Hydration:** Avoid introducing framework islands when vanilla JS or Astro components suffice.

### 2. Infrastructure & Cloud

- **Adopt:**
  - **Cloudflare Workers Builds:** Production deployment pipeline (`wrangler.jsonc`).
  - **Cloudflare KV:** Edge key-value caching for release summaries and visit stats.
- **Trial:**
  - **Render:** Isolated test environment for automated AI agent preview verification (`render.yaml`).
- **Assess:**
  - **Cloudflare Vectorize:** High-dimensional vector storage for semantic portfolio search.
- **Hold:**
  - **Traditional VPS / Dedicated Servers:** Production MUST run on Cloudflare Workers edge runtime.

### 3. Tooling & AI Workflows

- **Adopt:**
  - **Vitest:** Native TypeScript test runner for zero-dependency utility and API unit tests.
  - **Prettier & ESLint:** Enforced code formatting and linting pipelines.
  - **Husky & lint-staged:** Git pre-commit hooks for format check enforcement.
  - **PostHog:** Deferred dynamic-import analytics integration (`posthog-js`).
- **Trial:**
  - **Sentry (@sentry/astro & @sentry/cloudflare):** Application monitoring and error boundary tracing.
- **Assess:**
  - **Codecov Vite Plugin:** Automated bundle size and test coverage analysis in CI.
- **Hold:**
  - **Jest / Mocha:** Legacy test runners. Use Vitest exclusively.

### 4. Patterns & Architecture

- **Adopt:**
  - **Vanilla CSS Glassmorphism:** Lightweight, hardware-accelerated 'Northern Lights' aesthetic using Vanilla CSS variables.
  - **Zod Schema Boundaries:** Strict runtime validation for API payloads, frontmatter, and feature flags (`src/content.config.ts`).
  - **Single-Pass Array Traversals:** Zero-allocation `for...of` loops and reverse-indexed loops in Edge SSR functions.
  - **Feature Flags via Content Collections:** Isolated feature toggles (`src/content/flags/config.json`).
- **Trial:**
  - **DOM MutationObserver State Guarding:** Synchronizing state with `localStorage` while preventing redundant disk write I/O.
- **Assess:**
  - **Canvas DPR Capping:** Hardware-accelerated canvas micro-interactions capped at DPR <= 2.
- **Hold:**
  - **Tailwind CSS & Utility Frameworks:** Strictly forbidden. All layout and interactive styling uses Vanilla CSS.
  - **Unvalidated Inputs & `@ts-ignore`:** Banned across all files.

## Ring Definitions

- **Adopt:** High confidence, production-proven in this repo. Default choice for new work.
- **Trial:** High potential with low risk. Ready for isolated usage in minor features or test environments.
- **Assess:** Worth tracking and evaluating trade-offs; not yet recommended for active production standard.
- **Hold:** Phasing out, banned, or proven problematic in our setup. Do not use for new work.
