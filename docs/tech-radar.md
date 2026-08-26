# Repository Tech Radar

This document maintains the technology radar for this repository. It provides explicit ground-truth context for human developers and autonomous AI agents regarding active, trialed, assessed, and phased-out technologies and patterns.

## Rings

- **Adopt:** High confidence, production-proven in this repository. Default choice for new work.
- **Trial:** High potential with low risk. Ready for isolated usage in minor features, experimental routes, or scripts.
- **Assess:** Worth tracking and evaluating trade-offs; not yet recommended for active production code.
- **Hold:** Phasing out or proven problematic in our setup. Do not use for new work.

---

## Quadrants

### 1. Frameworks & Runtimes

- **Adopt:**
  - **Astro (v7+):** Core framework for static site rendering (`output: "static"`).
  - **TypeScript:** Mandatory strict type-checking environment.
  - **Node.js (>=22.12.0):** Standard execution runtime environment.
- **Trial:**
  - **@astrojs/node:** Used exclusively in the Render test environment for AI agent testing.
- **Assess:**
  - **Edge Workers SSR:** Full dynamic server-side rendering on Cloudflare Workers (currently static output is preferred).
- **Hold:**
  - **React / Vue / Svelte:** Client-side UI frameworks (favor Vanilla JS/Astro Islands to keep JS bundle lean).

### 2. Infrastructure & Cloud

- **Adopt:**
  - **Cloudflare Workers + Assets:** Unified production runtime & edge asset delivery (`wrangler.jsonc`).
  - **GitHub Actions:** CI pipeline for validation, linting, testing, and GitHub release creation.
- **Trial:**
  - **Render:** Secondary test environment host for Jules automated sandbox debugging.
- **Assess:**
  - **Cloudflare KV / D1 / Vectorize:** Edge storage & vector databases for potential future AI extensions.
- **Hold:**
  - **Legacy Cloudflare Pages:** Deprecated deployment format (`_routes.json`, `_headers` for Pages).

### 3. Tooling & AI Workflows

- **Adopt:**
  - **Vitest:** Standard unit and component testing framework.
  - **ESLint & Prettier:** Code quality, formatting, and style enforcement.
  - **Zod (v4+):** Standard runtime and compile-time data schema validation.
  - **Wrangler CLI:** Type generation (`wrangler types`) and deployment management.
- **Trial:**
  - **MCP (Model Context Protocol) Servers:** Context integration for AI agent workflows (`mcp_config.json`).
- **Assess:**
  - **Playwright E2E:** Visual verification and browser testing integration.
- **Hold:**
  - **npm audit automated fix scripts:** Unchecked auto-upgrades without trade-off analysis.

### 4. Patterns & Architecture

- **Adopt:**
  - **Workers-First Static Pre-Rendering:** Static HTML generation cached across Cloudflare edge locations.
  - **Vanilla CSS Glassmorphism:** Scoped custom properties preserving the 'Northern Lights' aesthetic.
  - **Structured Telemetry & Logging:** Standardized event logging without PII exposure.
  - **Architecture Decision Records (ADRs):** Sequential architectural governance (`docs/adr/`).
- **Trial:**
  - **Experimental Route Isolation (`src/pages/experimental/`):** Isolated feature sandboxing before main adoption.
- **Assess:**
  - **Edge Dynamic Caching Custom Headers:** Fine-grained cache-control strategies via worker middleware.
- **Hold:**
  - **Tailwind CSS / CSS-in-JS:** Banned utility/runtime styling frameworks.
  - **Direct main Branch Mutating Release Scripts:** CI workflows mutating protected git branches.
