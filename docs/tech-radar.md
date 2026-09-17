# Repository Tech Radar

## Quadrants

### 1. Frameworks & Runtimes

- **Adopt:**
  - Astro (v7+) - Core SSG framework for performance, SEO, and content collections.
  - TypeScript (Strict) - Mandatory type checking and schema validation across the codebase.
  - Node.js (v22.12.0+) - Standard runtime engine for local development and Render test environment.
- **Trial:**
  - `@astrojs/node` - Standalone Node adapter reserved for Render Jules test environment when `RENDER=true`.
- **Assess:**
  - Server-Sent Events (SSE) / Edge Stream Handlers - Potential future pattern for dynamic edge responses.
- **Hold:**
  - React / Vue / Svelte UI Framework Islands - Avoid heavy JS frameworks; preserve vanilla HTML/CSS/JS model.

### 2. Infrastructure & Cloud

- **Adopt:**
  - Cloudflare Workers + Assets (`wrangler.jsonc`) - Primary edge host for static assets and edge logic.
  - GitHub Actions CI - Automated PR quality checks, linting, tests, and GitHub Release generation.
- **Trial:**
  - Render Web Services - Secondary test environment for Google Jules debugging (`RENDER=true`).
- **Assess:**
  - Cloudflare KV / D1 - Edge storage bindings for future dynamic features.
- **Hold:**
  - Legacy Cloudflare Pages - Phased out in favor of Workers + Assets unified model.
  - Direct Writes to Protected `main` in CI - CI must not push generated release artifacts back to `main`.

### 3. Tooling & AI Workflows

- **Adopt:**
  - Vitest - Fast unit test runner for utilities and content validations.
  - Prettier & ESLint - Code style and linting enforcement across repository files.
  - Zod - Core runtime and compile-time schema validation library.
  - MCP Servers (`mcp_config.json`) - Model Context Protocol servers for AI tool integration.
- **Trial:**
  - Codecov Vite Plugin - Test coverage and bundle analysis integration.
- **Assess:**
  - Playwright / Automated E2E Visual Testing - Under evaluation for visual regression automation.
- **Hold:**
  - `pnpm` / `yarn` - Stick strictly to `npm` for package operations and lockfile maintenance.

### 4. Patterns & Architecture

- **Adopt:**
  - Static Pre-rendering (`output: "static"`) - Default build target for high performance and low latency.
  - Vanilla CSS & Northern Lights Theme - Custom CSS variables with glassmorphism aesthetics.
  - Feature Flags (`src/content/flags/config.json`) - Zod-validated JSON feature toggle configuration.
- **Trial:**
  - Experimental Subroutes (`src/pages/experimental/`) - Isolated routes for testing MVP enhancements.
- **Assess:**
  - View Transitions API - Native browser transition enhancements across static route navigation.
- **Hold:**
  - Tailwind CSS / External Utility CSS Frameworks - Prohibited to prevent bundle bloat and maintain custom styling control.
