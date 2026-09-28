# Repository Tech Radar

This Tech Radar tracks technologies, runtimes, tooling, and architectural patterns evaluated or adopted across the repository.

## Quadrants & Technologies

### 1. Frameworks & Runtimes

- **Adopt:**
  - **Astro 5+:** Core web framework for SSG and static island rendering.
  - **TypeScript 5+:** Strict type system enforcing type safety across all components and utilities.
  - **Cloudflare Workers (`@astrojs/cloudflare`):** Production runtime for global edge execution and SSR/edge routes.
- **Trial:**
  - **Node.js 22 LTS (`@astrojs/node`):** Secondary standalone server runtime for isolated testing and Google Jules environment.
- **Assess:**
  - **Cloudflare Workers Smart Placement:** Automated edge route placement optimization.
- **Hold:**
  - **Client-side Heavy Frameworks (React, Vue, Svelte):** Avoid introducing multi-framework runtime overhead; prefer static HTML and lightweight Vanilla Web Components / TypeScript scripts.

### 2. Infrastructure & Cloud

- **Adopt:**
  - **Cloudflare Workers / Pages:** Edge deployment platform for high availability and low LCP.
  - **Cloudflare Headers (`public/_headers`):** Immutable asset caching policy and static header definition.
- **Trial:**
  - **Workers KV / Cache API:** Edge caching layers for dynamic asset response caching.
- **Assess:**
  - **Cloudflare Vectorize / AI Workers:** Potential future AI integrations at edge.
- **Hold:**
  - **Traditional Express / Node VM Deployments:** Phased out in favor of serverless edge execution.

### 3. Tooling & AI Workflows

- **Adopt:**
  - **Vitest:** Fast unit testing engine for utilities, schemas, and RSS/Sitemap mock tests.
  - **ESLint & Prettier:** Automated formatting and linting verification pipeline.
  - **Wrangler CLI:** Local development and worker preview runtime.
  - **Jules & Autonomous Agents:** Specialized agentic workflows operating under strict constraints and ADR boundaries.
- **Trial:**
  - **Playwright:** E2E and visual regression verification for interactive components.
- **Assess:**
  - **Automated Visual Diffing Tools:** CI-level screenshot regression checks.
- **Hold:**
  - **Unconstrained AI Direct Edits:** Direct edits bypassing validation pipelines (`npm run format`, `npm run lint`, `npm run test`).

### 4. Patterns & Architecture

- **Adopt:**
  - **Static Feature Flags via Content Collections (ADR 0002):** Zod-validated static flag toggles in `src/content/flags/config.json`.
  - **Vanilla CSS Glassmorphism & Northern Lights Theme:** Zero CSS framework, high-performance scoped styles.
  - **Lifecycle Teardown on Navigation:** `astro:before-swap` event handlers cleaning up `requestAnimationFrame` loops and canvas listeners.
  - **Module-Level Hoisting:** Hoisting `Intl.DateTimeFormat` instances to module-level scope for edge execution.
- **Trial:**
  - **Canvas Refraction & Smoothstep Math:** Custom zero-dependency canvas visual animations.
- **Assess:**
  - **Web Workers for Canvas Math:** Offloading visual calculation to background worker threads.
- **Hold:**
  - **Tailwind CSS / Heavy Utility CSS Frameworks:** Unnecessary CSS abstraction layer conflicting with scoped Vanilla CSS architecture.
  - **Uncurated 3D Assets (.obj, .gltf):** High payload sizes degrade Core Web Vitals.
