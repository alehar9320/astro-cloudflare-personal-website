# Repository Tech Radar

This document maintains the ground-truth technology status across 4 operational quadrants and 4 evaluation rings for Alexander Härenstam's personal portfolio codebase. It provides explicit architectural boundaries for human engineers and autonomous AI agents.

---

## Rings

- **Adopt:** High confidence, production-proven in this repository. Default choice for all new features and components.
- **Trial:** High potential with low risk. Approved for isolated usage in minor feature flags or experimental routes (`src/pages/experimental/`).
- **Assess:** Worth tracking and evaluating trade-offs; under active evaluation before consideration for production runtime.
- **Hold:** Phasing out, banned, or proven problematic in our setup. MUST NOT be used or introduced in new pull requests.

---

## Quadrants

### 1. Frameworks & Runtimes

- **Adopt:**
  - **Astro (v4+):** Core static site generator framework (`output: "static"`).
  - **TypeScript (Strict Mode):** Mandatory typed runtime across client scripts and Cloudflare Workers handlers.
  - **Vanilla CSS:** Primary styling methodology utilizing standard CSS variables and glassmorphic tokens.
- **Trial:**
  - **HTML5 Canvas / Pure TS Particle Engines:** Safe-space experimental interactive visual canvases (`src/pages/lab/`).
- **Assess:**
  - **WebGPU / Native Shader FX:** Lightweight WebGL/WebGPU visual experiments without heavy client libraries.
- **Hold:**
  - **Tailwind CSS / CSS Utility Frameworks:** Prohibited to maintain zero-dependency scoped CSS and token consistency.
  - **React / Vue / Svelte / Angular:** Banned from client runtime to prevent bundle inflation and DOM hydration overhead.
  - **jQuery / Heavy Animation Frameworks (GSAP, Framer Motion):** Prohibited in favor of CSS keyframe transitions and hardware acceleration.

### 2. Infrastructure & Cloud

- **Adopt:**
  - **Cloudflare Workers + Assets:** Unified production runtime and edge asset serving (`wrangler.jsonc`).
  - **GitHub Actions CI/CD:** Automated verification pipelines for formatting, linting, unit testing, and releases.
- **Trial:**
  - **Render Node Standalone Server:** Jules AI debugging test environment (`@astrojs/node` via `render.yaml`).
- **Assess:**
  - **Cloudflare KV / D1 / Durable Objects:** Edge data storage options for dynamic user interactions.
- **Hold:**
  - **Cloudflare Pages (Legacy Build Output):** Deprecated in favor of the unified Workers + Assets architecture.
  - **AWS / Vercel / Netlify Direct Deployments:** Prohibited to concentrate deployment pipeline exclusively on Cloudflare Workers.

### 3. Tooling & AI Workflows

- **Adopt:**
  - **Vitest:** Fast unit and integration testing runner (`npm run test`).
  - **Prettier & Prettier Astro Plugin:** Code formatting standard (`npm run format`).
  - **ESLint & typescript-eslint:** Static linting and code quality analysis (`npm run lint`).
  - **Astro Check (`@astrojs/check`):** Structural component and type checking (`npm run check`).
  - **Husky & lint-staged:** Git pre-commit verification hooks.
- **Trial:**
  - **Context7 / MCP Servers:** Local documentation retrieval and context augmentation tools (`mcp_config.json`).
  - **Sentry (@sentry/astro, @sentry/cloudflare):** Real-time error monitoring and edge telemetry.
  - **PostHog JS:** Client-side privacy-focused telemetry (`posthog-js`).
- **Assess:**
  - **Playwright Visual Testing:** Automated visual verification via headless browser scripts.
- **Hold:**
  - **Jest / Mocha / Jasmine:** Superseded by Vitest.
  - **Webpack / Rollup Manual Configs:** Replaced by Vite/Astro build tooling.

### 4. Patterns & Architecture

- **Adopt:**
  - **Static Island Pre-Rendering:** Static HTML pre-rendered at build time for sub-second edge responses.
  - **Zod Schema Boundaries:** Type-safe runtime and compile-time data validation in `src/content.config.ts` and API routes.
  - **Explicit Image Dimensions (CLS=0):** Mandated `width` and `height` attributes on all visual media.
  - **WCAG 2.1 AA Compliance:** High contrast accessibility, custom focus-visible rings, and `prefers-reduced-motion` fallbacks.
  - **Astro Canvas Teardown (`astro:before-swap`):** Explicit event listener cleanup and frame cancellation on page transitions.
- **Trial:**
  - **Pointer-Based SSE Stream Parsing:** Efficient string traversal for edge streaming response handlers (`src/utils/chat-stream.ts`).
  - **Feature Flags (`src/content/flags/`):** Isolated feature toggles for safe experimental deployments.
- **Assess:**
  - **Dynamic Telemetry Code Splitting:** Deferring third-party telemetry imports behind conditional activation checks.
- **Hold:**
  - **Client-Side Heavy Hydration (`client:load`, `client:only`):** Restricted unless static HTML/CSS cannot satisfy UX requirements.
  - **Global State Management Stores (Redux, Zustand, MobX):** Forbidden; prefer lightweight native URL state or minimal Astro store.
