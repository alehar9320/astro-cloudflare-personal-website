# Repository Tech Radar

This document maintains technology choices and architectural choices across Alexander Härenstam's personal portfolio. It provides ground-truth context for human developers and autonomous AI agents.

## Operational Quadrants

1. **Frameworks & Runtimes**
2. **Infrastructure & Cloud**
3. **Tooling & AI Workflows**
4. **Patterns & Architecture**

## Radar Rings

- **Adopt:** High confidence, production-proven in this repository. Default choice for new work.
- **Trial:** High potential with low risk. Ready for isolated usage in minor features or experimental routes.
- **Assess:** Worth tracking and evaluating trade-offs; not yet recommended for active production code.
- **Hold:** Phasing out or proven problematic in our setup. Do not use for new work.

---

## 1. Frameworks & Runtimes

- **Adopt:**
  - **Astro 5 (`astro`):** Primary static site generator and SSR framework for personal portfolio pages and content collections.
  - **TypeScript:** Strict type checking across components, utilities, and API endpoint handlers.
  - **Cloudflare Workers Edge Runtime:** Production SSR & static asset edge execution context via `@astrojs/cloudflare`.
- **Trial:**
  - **Node.js Standalone Server (`@astrojs/node`):** Secondary runtime target enabled strictly when `RENDER=true` for Google Jules test sessions.
- **Assess:**
  - **WebGPU / OffscreenCanvas:** Advanced canvas rendering capabilities for interactive background graphics in `src/pages/lab/`.
- **Hold:**
  - **React / Vue / Svelte / Heavy Client Frameworks:** Avoid introducing heavy UI framework runtimes for simple static components; leverage Astro islands and native Vanilla Web APIs.

## 2. Infrastructure & Cloud

- **Adopt:**
  - **Cloudflare Pages / Workers (`wrangler`):** Static asset hosting, custom worker entrypoint (`src/cloudflare-worker.ts`), and edge route handlers.
  - **Cloudflare Workers KV:** Key-value storage for edge visitor counts and analytics.
- **Trial:**
  - **Workers AI (`@cloudflare/ai`):** Serverless edge AI inferences for personal chat agent endpoints.
- **Assess:**
  - **Cloudflare D1 / Vectorize:** Structured SQL database or vector search capabilities for extended portfolio knowledge bases.
- **Hold:**
  - **AWS S3 / External Cloud Storage:** Do not introduce external AWS/GCP storage buckets when Cloudflare edge storage suffices.

## 3. Tooling & AI Workflows

- **Adopt:**
  - **Vitest (`vitest`):** Fast unit testing framework for utilities, content schemas, and API handlers.
  - **ESLint (`eslint`) & Prettier (`prettier`):** Code quality, linting rules, and strict formatting.
  - **Jules / Autonomous Agent Workflows:** Specialized autonomous sub-agents (Apex, Aurora, Kinetic, Prism, Bolt, Stratus, Archie, etc.) working via structured agent directives.
- **Trial:**
  - **Sentry (`@sentry/astro`, `@sentry/cloudflare`):** Error tracking and performance monitoring.
- **Assess:**
  - **Playwright / E2E Visual Regression Testing:** Automated browser verification for visual UI components.
- **Hold:**
  - **Tailwind CSS / External CSS Frameworks:** Banned. Rely on Vanilla CSS with scoped Astro styles and CSS custom properties.

## 4. Patterns & Architecture

- **Adopt:**
  - **Static Feature Flags (`src/content/flags/config.json`):** Type-safe feature flag toggles validated via Zod content collections.
  - **Zod Schema Validation:** Input validation for content collections, environment variables, and API request payloads.
  - **Northern Lights Visual Design System:** Dark background (`#0d1117`), cyan/purple gradients, and high contrast glassmorphism.
  - **WCAG 2.1 AA Accessibility Standards:** 44x44px minimum touch target ergonomics, high-contrast borders, and `prefers-reduced-motion` CSS overrides.
- **Trial:**
  - **Canvas Smoothstep Light Refraction:** Pure TS canvas displacement math for interactive elements.
- **Assess:**
  - **Client-side Web Workers:** Offloading heavy canvas math calculations off the main thread.
- **Hold:**
  - **Dynamic Client Hydration (`client:load`, `client:only`):** Avoid client hydration unless passive CSS or static HTML is insufficient.
