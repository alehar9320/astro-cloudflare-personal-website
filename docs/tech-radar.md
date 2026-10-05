# Repository Tech Radar

This Tech Radar documents technology choices, architectural patterns, and engineering anti-patterns for Alexander Härenstam's personal portfolio repository. It provides explicit ground-truth context for human developers and autonomous AI agents.

## Rings

- **Adopt:** High confidence, production-proven in this repo. Default choice for new work.
- **Trial:** High potential with low risk. Ready for isolated usage in minor experimental features or scripts (`src/pages/lab/`).
- **Assess:** Worth tracking and evaluating trade-offs; not yet recommended for active production code.
- **Hold:** Phasing out or proven problematic in our setup. Forbidden for new work.

---

## Quadrants

### 1. Frameworks & Runtimes

- **Adopt:**
  - **Astro v4+ (`output: "static"`):** Core web framework providing static pre-rendering with zero client-side JavaScript by default.
  - **Cloudflare Workers + Assets:** Edge runtime deployment target (`wrangler.jsonc`).
  - **TypeScript (Strict Mode):** Type-safe JavaScript across components, scripts, and edge logic.
- **Trial:**
  - **Node standalone server (`RENDER=true`):** Used strictly for test environments and AI agent runner debugging.
- **Assess:**
  - **Web Workers:** Potential for offloading heavy canvas particle math off the main browser thread.
- **Hold:**
  - **Tailwind CSS / Heavy UI Frameworks:** Prohibited. Style strictly via Vanilla CSS and custom CSS custom properties.
  - **Client-side JS UI Frameworks (React, Vue, Svelte):** Prohibited for main portfolio routes to preserve zero-JS baseline.

### 2. Infrastructure & Cloud

- **Adopt:**
  - **Cloudflare Workers Assets:** Direct static asset serving at the edge.
  - **GitHub Actions:** CI pipeline (`ci.yml`) enforcing linting, testing, formatting, and release automation.
  - **Sentry Edge SDK (`@sentry/cloudflare`):** Edge-compatible exception telemetry.
- **Trial:**
  - **Cloudflare KV:** Bound in `wrangler.jsonc` for light key-value caching needs.
- **Assess:**
  - **Cloudflare D1 / Vectorize:** For future semantic search or RAG capabilities over author context.
- **Hold:**
  - **Deprecated Cloudflare Pages Model:** Replaced by Workers-First Workers + Assets binding.
  - **Direct Production Pushes via Scripts:** Production deploys are owned exclusively by Cloudflare Git integration on `main`.

### 3. Tooling & AI Workflows

- **Adopt:**
  - **Vitest:** Native unit testing framework.
  - **Zod:** Compile-time and runtime schema validation for content collections and config.
  - **Prettier & ESLint:** Mandatory code formatting and static code linting.
  - **PostHog:** Deferred client-side analytics (`posthog-js`).
- **Trial:**
  - **Model Context Protocol (MCP) Servers:** Configured in `mcp_config.json` (`astro-docs`, `context7`).
- **Assess:**
  - **Automated Visual Regression Testing:** Playwright/Chromium snapshots for visual micro-interactions.
- **Hold:**
  - **3rd-Party NPM Feature-Flag Libraries:** Prohibited. Use static JSON content collections instead (`src/content/flags/config.json`).

### 4. Patterns & Architecture

- **Adopt:**
  - **Workers-First Deployment:** Single `wrangler.jsonc` configuration with unified edge handler.
  - **Type-Safe Static Feature Flags:** Gated via Zod schemas in `src/content.config.ts`.
  - **Vanilla CSS 'Northern Lights' Theme:** Marine blue/cyan gradients, glassmorphism, native CSS variables.
  - **Module-Level Hoisting:** Hoisting Intl.DateTimeFormat and static formatters at module level for edge memory efficiency.
- **Trial:**
  - **Experimental Canvas Laboratory (`src/pages/lab/`):** Isolated playground for WebGL and 2D canvas micro-interactions.
- **Assess:**
  - **Web Audio Micro-Feedback:** Subtle ambient audio feedback for key UI interactions behind feature flags.
- **Hold:**
  - **Heavy Client-Side Animation Libraries (Framer Motion, GSAP):** Prohibited. Use CSS hardware-accelerated transitions or lightweight native HTML5 Canvas requestAnimationFrame loops.
  - **Root-Level AI Agent Journals:** Prohibited. Agent journals live strictly under `.Jules/`.
