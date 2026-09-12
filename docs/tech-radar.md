# Repository Tech Radar

This document tracks technology choices, architectural patterns, and tooling choices across the repository.

## Quadrants

### 1. Frameworks & Runtimes

- **Adopt:**
  - **Astro (`^7.2.9`):** Core static site generator and dynamic server renderer. Primary framework choice.
  - **TypeScript (`^5.8.2`):** Type safety across client components, Worker handlers, and utilities.
  - **Cloudflare Workers (`@astrojs/cloudflare`):** Production edge server runtime.
- **Trial:**
  - **Node.js runtime (`@astrojs/node`):** Secondary environment reserved exclusively for isolated testing / Jules debugging.
- **Assess:**
  - **Edge SSR Micro-services:** Evaluating isolated sub-worker routing for modular features.
- **Hold:**
  - **Client-side Heavy Frameworks (React/Vue/Svelte):** Banned for core pages to preserve minimalist zero-JS / low-JS performance.

### 2. Infrastructure & Cloud

- **Adopt:**
  - **Cloudflare Workers / Pages:** Primary production target host (`wrangler.jsonc`).
  - **Cloudflare KV / AI Bindings:** Production edge storage and serverless AI invocation bindings.
- **Trial:**
  - **Render:** Secondary Jules sandbox deployment runtime.
- **Assess:**
  - **Cloudflare D1 / Vectorize:** Evaluating for future structured edge database needs.
- **Hold:**
  - **Traditional VPS / Monolithic Cloud Hosting:** Banned in favor of serverless edge architecture.

### 3. Tooling & AI Workflows

- **Adopt:**
  - **Vitest (`^4.1.2`):** Native unit testing runner.
  - **ESLint (`^10.9.1`) & Prettier (`^3.8.3`):** Code quality, linting, and formatting pipeline.
  - **Sentry (`@sentry/astro`, `@sentry/cloudflare`):** Monitoring and telemetry tracking.
  - **PostHog (`posthog-js`):** User analytics and event logging.
- **Trial:**
  - **Husky (`^9.1.7`) & lint-staged (`^17.4.1`):** Git pre-commit enforcement hooks.
- **Assess:**
  - **Playwright:** Web UI automated end-to-end testing scripts.
- **Hold:**
  - **pnpm / yarn:** Banned package managers; repository strictly uses `npm`.

### 4. Patterns & Architecture

- **Adopt:**
  - **Zod Schema Validation (`zod`):** Strict boundary validation for content collections, API requests, and environment variables.
  - **Static Glassmorphic CSS:** Vanilla CSS with hardware-accelerated animations (`transform`, `opacity`) and WCAG accessibility compliance.
  - **Hoisted Static RegExp & Constant Tables:** High-performance edge utility optimizations for Cloudflare Workers.
- **Trial:**
  - **Feature Flags (`src/content/flags/config.json`):** Gating experimental features and routes cleanly.
- **Assess:**
  - **Edge Streaming UI Responses:** Evaluated for streaming AI responses.
- **Hold:**
  - **Tailwind CSS / CSS Frameworks:** Banned in favor of standard Vanilla scoped CSS.
  - **Global State Libraries (Redux/Zustand):** Banned for static/lightweight architecture.

## Rings

- **Adopt:** High confidence, production-proven in this repo. Default choice for new work.
- **Trial:** High potential with low risk. Ready for isolated usage in minor features or scripts.
- **Assess:** Worth tracking and evaluating trade-offs; not yet recommended for active production code.
- **Hold:** Phasing out or proven problematic in our setup. Do not use for new work.
