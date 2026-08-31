# Repository Tech Radar

This document maintains the ground-truth status of technology choices and operational patterns across the repository.

## Quadrants & Technology Status

### 1. Frameworks & Runtimes

- **Adopt:**
  - **Astro (v7):** Core web framework used for static site generation and component architecture.
  - **TypeScript:** Mandatory strict type checking across all application logic, scripts, and edge handlers.
  - **Cloudflare Workers Runtime (`@astrojs/cloudflare`):** Production deployment target for edge routing and SSR capabilities.
- **Trial:**
  - **Node.js Standalone Adapter (`@astrojs/node`):** Secondary runtime adapter isolated strictly for Jules test environment execution on Render (`RENDER=true`).
- **Assess:**
  - **Web Workers / Off-Main-Thread Processing:** Heavy computation offloading for interactive canvas experiments in `src/pages/lab/`.
- **Hold:**
  - **Heavy Client Hydration Frameworks (React, Vue, Svelte):** Client-side JS component frameworks are banned; pure Astro static HTML and scoped Vanilla JS are required.

---

### 2. Infrastructure & Cloud

- **Adopt:**
  - **Cloudflare Workers / Pages:** Production deployment and global edge distribution platform (`wrangler.jsonc`).
  - **Sentry Integration (`@sentry/astro`, `@sentry/cloudflare`):** Edge error tracking and telemetry monitoring.
  - **PostHog Analytics (`posthog-js`):** Client-side privacy-friendly product analytics.
- **Trial:**
  - **Render Services (`render.yaml`):** Isolated testing environment for autonomous agent execution under Node.
- **Assess:**
  - **Cloudflare KV / D1 Edge Storage:** Distributed edge data caching for dynamic portfolio features.
- **Hold:**
  - **Multi-Cloud Failover Pipelines:** Directing production traffic through Node servers or non-Cloudflare production targets.

---

### 3. Tooling & AI Workflows

- **Adopt:**
  - **Vitest & V8 Coverage:** Unit testing framework for utility functions, schemas, and identity verification.
  - **ESLint, Prettier & Husky:** Static code analysis, formatting enforcement, and pre-commit hooks.
  - **Zod (v4) Schema Validation:** Strict schema definitions for content collections and feature flags (`src/content.config.ts`).
  - **Specialized Autonomous AI Agents:** Role-based agent directives (Archie, Jules, Palette, Bolt, Vantage, Engine, Titan).
- **Trial:**
  - **Playwright Visual Testing (Python API):** Automated visual regression testing and screenshot capture for frontend changes.
- **Assess:**
  - **MCP (Model Context Protocol) Servers:** Context augmentation for automated workflows (`mcp_config.json`).
- **Hold:**
  - **Unverified Third-Party Package Additions:** Adding npm packages without explicit trade-off evaluation and authorization.

---

### 4. Patterns & Architecture

- **Adopt:**
  - **JSON Feature Flags (`src/content/flags/config.json`):** Decoupled feature toggling and agent experiment isolation validated by Zod schemas.
  - **Interactive Canvas Laboratory Isolation (`src/pages/lab/`):** Dedicated directory for experimental canvas, 3D, and interactive WebGL modules.
  - **Vanilla CSS & Glassmorphic Custom Properties:** Native CSS custom properties enforcing 'Northern Lights' aesthetic without utility-first frameworks.
  - **Explicit Canvas Teardown:** Binding `cancelAnimationFrame` and event cleanup listeners to `astro:before-swap`.
- **Trial:**
  - **Pointer-Based SSE Parsing:** Efficient stream parsing withoutdynamic string array allocations (`src/utils/chat-stream.ts`).
- **Assess:**
  - **View Transitions API Integration:** Native browser-driven page transition effects.
- **Hold:**
  - **Tailwind CSS / External CSS Frameworks:** Forbidden in favor of scoped native CSS.
  - **Unflagged Global State or Layout Mutations:** Modifications to global layout or worker routing without isolation flags.
