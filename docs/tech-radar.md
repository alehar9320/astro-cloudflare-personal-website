# Repository Tech Radar

This Tech Radar tracks technologies, frameworks, infrastructure choices, tooling, and architectural patterns used across Alexander Härenstam's personal portfolio repository. It provides explicit ground-truth context for human developers and autonomous AI agents.

## Structure

### Rings

- **Adopt:** High confidence, production-proven in this repository. Default choice for new work.
- **Trial:** High potential with low risk. Ready for isolated usage in minor features, experimental routes, or scripts.
- **Assess:** Worth tracking and evaluating trade-offs; not yet recommended for active production code.
- **Hold:** Phasing out, anti-patterns, or proven problematic in our setup. Do not use for new work.

---

## Quadrants

### 1. Frameworks & Runtimes

- **Adopt:**
  - **Astro (v4+)**: Core SSG framework for personal portfolio.
  - **TypeScript (Strict mode)**: Mandatory static typing across all scripts and components.
  - **Cloudflare Workers (Workers-First Model)**: Production execution runtime via `@astrojs/cloudflare` and `wrangler.jsonc`.
- **Trial:**
  - **@astrojs/node**: Render test environment server runtime for AI debugging (`RENDER=true`).
- **Assess:**
  - **WebAssembly (WASM)**: Edge compute acceleration for micro-utilities if needed in the future.
- **Hold:**
  - **Cloudflare Pages Legacy Model**: Deprecated in favor of the unified Workers + Assets architecture.
  - **Client-side Heavy JS Frameworks (React, Vue, Svelte, Framer Motion)**: Banned for production pages to preserve fast load times and minimal bundle size.

### 2. Infrastructure & Cloud

- **Adopt:**
  - **Cloudflare Workers & Assets**: Global edge static hosting and serverless request routing.
  - **GitHub Actions**: Automated CI validation (`ci.yml`) and versioned GitHub release publishing (`release.js`).
- **Trial:**
  - **Cloudflare KV / D1 / Vectorize**: Edge bindings for potential future dynamic capabilities.
- **Assess:**
  - **Cloudflare AI Workers**: On-demand edge inference for search or micro-agents.
- **Hold:**
  - **Direct GitHub main writes from CI**: Protected branch security requires zero direct CI commits back to `main`.
  - **Secondary Production Cloud Providers**: Cloudflare Workers is the sole production runtime; alternative clouds are for testing only.

### 3. Tooling & AI Workflows

- **Adopt:**
  - **Vitest**: Native TypeScript test runner for unit tests and route handlers.
  - **Zod**: Type-safe schema validation for content collections, environmental variables, and feature flags.
  - **Prettier & ESLint**: Automated code formatting and static code quality linting.
  - **Phosphor Icons**: Native SVG icon set managed via `src/components/IconPaths.ts`.
- **Trial:**
  - **Model Context Protocol (MCP)**: Local AI tools integration via `mcp_config.json`.
- **Assess:**
  - **Playwright**: Automated end-to-end browser testing.
- **Hold:**
  - **Tailwind CSS & CSS Frameworks**: Banned in favor of vanilla CSS and CSS Custom Properties.
  - **Third-party npm runtime dependencies**: Strict limitation on adding new production npm packages without explicit review.

### 4. Patterns & Architecture

- **Adopt:**
  - **Workers-First Static Island Pre-rendering**: Static HTML output (`output: "static"`) with edge Worker fallback.
  - **Type-Safe Static Feature Flags**: JSON feature toggles validated via Zod content schemas (`src/content/flags/config.json`).
  - **Vanilla CSS Glassmorphism & Northern Lights Theme**: Lightweight CSS styling with marine blue & cyan accents.
  - **Module-Level Object Hoisting**: Edge performance optimization for Intl, Regex, and static assets.
- **Trial:**
  - **Dynamic Spatial Step Sampling for Canvas**: Viewport-adaptive rendering for interactive HTML5 canvas animations (`/lab/`).
- **Assess:**
  - **Edge Geo-Personalization**: Content adaptation using Cloudflare `request.cf` geolocation headers.
- **Hold:**
  - **Client-Side Hydration (`client:load`, `client:only`)**: Avoided unless static HTML or passive CSS is insufficient.
  - **Unflagged Micro-Interactions**: Visual experiments must be feature-flagged.
