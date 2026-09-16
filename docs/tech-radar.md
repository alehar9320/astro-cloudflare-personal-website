# Repository Tech Radar

This document maintains the technology radar for Alexander Härenstam's personal portfolio repository. It serves as ground-truth context for human developers and autonomous AI agents (`Archie`, `Jules`, `Sentinel`, `Bolt`, `Prism`, `Apex`, `Vantage`, etc.).

---

## Quadrants

### 1. Frameworks & Runtimes

- **Adopt:**
  - **Astro (v7+):** Static-first web framework powering SSG rendering, content collections, and hybrid SSR routes (`@astrojs/cloudflare`).
  - **Cloudflare Workers Edge Runtime:** Production target runtime providing serverless edge execution with low-latency global distribution (`src/cloudflare-worker.ts`).
  - **TypeScript (Strict Mode):** Core language for type safety across components, utilities, and tests without `any` or `@ts-ignore`.

- **Trial:**
  - **Node.js (v22.12+ Standalone):** Secondary execution target for Jules testing environment (`@astrojs/node` via `render.yaml`).

- **Assess:**
  - **WebGPU / WebGL Native Canvas:** Pure canvas animation loops (`requestAnimationFrame`) for laboratory interactive micro-experiences (`src/pages/lab/`).

- **Hold:**
  - **React / Vue / Svelte Heavy Hydration Frameworks:** Unnecessary runtime client JS payload for static-first portfolio.
  - **Express / Fastify / NestJS:** Node-centric monolithic server frameworks incompatible with edge Workers architecture.

---

### 2. Infrastructure & Cloud

- **Adopt:**
  - **Cloudflare Workers & KV:** Production edge deployment host and key-value storage (`wrangler.jsonc`).
  - **Cloudflare Worker AI:** Native LLM binding for edge chat capabilities (`env.AI`).

- **Trial:**
  - **Render Platform:** Jules test environment host running standalone Node server builds.
  - **Sentry Error Tracking:** Client and server exception monitoring (`@sentry/astro`, `@sentry/cloudflare`).

- **Assess:**
  - **PostHog Telemetry:** Dynamic analytics dynamic import chunking (`posthog-js`).

- **Hold:**
  - **AWS Lambda / GCP Cloud Functions:** Cold-start prone traditional serverless environments outside Cloudflare Workers ecosystem.

---

### 3. Tooling & AI Workflows

- **Adopt:**
  - **Vitest:** Native unit test runner for all utilities, API handlers, and release scripts.
  - **Prettier & ESLint (Astro Plugin):** Code formatting and linting enforcement pipeline.
  - **Husky & lint-staged:** Git hooks executing pre-commit formatting and linting.
  - **Autonomous AI Agent Governance:** Specialized agent personas (`Archie`, `Sentinel`, `Bolt`, `Prism`, `Apex`, `Vantage`, `Engine`, `Janitor`, `Docu`, `StuntDouble`, `FixtureRefresher`, `ObservabilityClerk`, `Pruning`, `Aurora`).

- **Trial:**
  - **Codecov Bundle Analysis:** Vite bundle analysis integration (`@codecov/vite-plugin`).

- **Assess:**
  - **Playwright E2E Verification:** Visual frontend verification and Playwright integration tests.

- **Hold:**
  - **Jest / Mocha:** Legacy test runners superseded by Vitest.
  - **Yarn / pnpm:** Strict single-package-manager repository requirement enforcing `npm` (`package-lock.json`).

---

### 4. Patterns & Architecture

- **Adopt:**
  - **Zero-Dependency Edge Utilities:** Pure TypeScript helper functions without runtime NPM dependencies (`src/utils/`).
  - **Zod Schema Validation:** Strict contract validation for content collections, API endpoints, and configuration fixtures (`src/content.config.ts`).
  - **Feature Flag Gating:** Declarative feature flags (`src/content/flags/config.json`) protecting experimental UI features.
  - **Focus-Visible Accessibility Target Sizing:** WCAG 2.1 AA touch target standards (44x44px) and `:focus-visible` ring containment.
  - **Astro Lifecycle Teardown:** Canvas `requestAnimationFrame` and event listener teardown on `astro:before-swap` during client-side navigation.

- **Trial:**
  - **Dynamic Import Analytics:** Deferred third-party telemetry dynamic imports (`await import(...)`).

- **Assess:**
  - **Pointer-Based Character Scanning:** Single-pass string/line scanning replacing multi-pass `.split()` dynamic array allocations.

- **Hold:**
  - **Dynamic `set:html` Injection:** Untrusted raw HTML rendering without Zod validation or static sanitization.
  - **Global CSS Pollution:** Unscoped global styling bypasses in component files.
  - **Runtime CSS-in-JS Libraries:** Excessive client hydration and runtime overhead.
