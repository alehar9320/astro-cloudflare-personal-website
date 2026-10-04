# Repository Tech Radar

This Tech Radar tracks the technology choices, framework decisions, patterns, and tooling active or evaluated in this repository. It provides explicit ground-truth context for human developers and autonomous AI agents.

## Quadrants

### 1. Frameworks & Runtimes

- **Adopt:**
  - **Astro (`v7.x`):** Primary static-first web framework and component architecture.
  - **Cloudflare Workers / Cloudflare Pages:** Primary production edge runtime environment.
  - **TypeScript (`v5.x`):** Strict type safety across all components, scripts, and configuration.
- **Trial:**
  - **Node.js (`v22.x`):** Standalone server target for Jules testing environment (`RENDER=true`).
- **Assess:**
  - **WebGPU / WebGL Canvas:** Experimental interactive rendering in `src/pages/lab/`.
- **Hold:**
  - **React / Vue / Svelte hydration frameworks:** Avoid heavy dynamic UI frameworks; rely on static Astro HTML + Vanilla CSS / JS micro-interactions.

### 2. Infrastructure & Cloud

- **Adopt:**
  - **Cloudflare Workers (`@astrojs/cloudflare`):** Production edge platform.
  - **Wrangler (`v4.x`):** Cloudflare deployment CLI and type generation tool.
- **Trial:**
  - **Render (`render.yaml`):** Isolated test execution runtime for automated agents.
- **Assess:**
  - **Cloudflare KV / D1:** Edge storage capabilities for future server-side state if needed.
- **Hold:**
  - **Monolithic Node.js Hosting (e.g. Heroku, AWS EC2):** Production is strictly edge-first via Cloudflare Workers.

### 3. Tooling & AI Workflows

- **Adopt:**
  - **Vitest (`v4.x`):** Fast, native unit testing framework.
  - **Prettier & ESLint:** Automated formatting and linting rules.
  - **Zod (`v4.x`):** Type-safe schema validation for content collections and environment variables.
  - **Husky & lint-staged:** Git hook enforcement for pre-commit formatting and linting checks.
- **Trial:**
  - **Sentry & PostHog:** Telemetry, error reporting, and product analytics integration.
- **Assess:**
  - **Playwright / End-to-End Visual Testing:** Potential addition for visual regression validation.
- **Hold:**
  - **Jest:** Replaced by Vitest.

### 4. Patterns & Architecture

- **Adopt:**
  - **Static Island Hydration:** Zero-JS by default, hydrating UI elements only when micro-interactions are required.
  - **Static Feature Flags:** Feature toggling gated via Astro Content Collections (`src/content/flags/config.json`) and Zod schemas.
  - **Vanilla CSS Glassmorphism & Micro-interactions:** Northern Lights aesthetic with hardware-accelerated CSS (`transform`, `opacity`).
- **Trial:**
  - **Dynamic Spatial Step Sampling:** High-performance Canvas animation loop sampling.
- **Assess:**
  - **Edge-cached API proxying:** Forwarding external queries through Cloudflare Worker edge routes.
- **Hold:**
  - **Tailwind CSS / CSS-in-JS Libraries:** Vanilla CSS with standard design tokens and variables is strictly enforced.

## Rings

- **Adopt:** High confidence, production-proven in this repo. Default choice for new work.
- **Trial:** High potential with low risk. Ready for isolated usage in minor features or scripts.
- **Assess:** Worth tracking and evaluating trade-offs; not yet recommended for active production code.
- **Hold:** Phasing out or proven problematic in our setup. Do not use for new work.
