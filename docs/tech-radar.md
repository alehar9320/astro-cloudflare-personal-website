# Repository Tech Radar

The Tech Radar tracks technology adoption, evaluation, and phase-out across four quadrants and four rings within this repository.

## Quadrants

1. **Frameworks & Runtimes**
2. **Infrastructure & Cloud**
3. **Tooling & AI Workflows**
4. **Patterns & Architecture**

## Rings

- **Adopt:** High confidence, production-proven in this repo. Default choice for new work.
- **Trial:** High potential with low risk. Ready for isolated usage in minor features or scripts.
- **Assess:** Worth tracking and evaluating trade-offs; not yet recommended for active production code.
- **Hold:** Phasing out or proven problematic in our setup. Do not use for new work.

---

## 1. Frameworks & Runtimes

- **Adopt:**
  - **Astro (v4+):** Primary web framework for static site generation and component architecture.
  - **TypeScript (Strict Mode):** Core language for all application logic and utility scripts.
  - **Node.js (>=22.12.0):** Standard runtime engine for local development, build scripts, and CI.
- **Trial:**
  - **Cloudflare Workers AI:** Edge AI model bindings (`@lenny` / LLM integrations) in worker handlers.
- **Assess:**
  - **WebAssembly (Wasm):** Edge-compiled modules for performance-critical client/worker computations.
- **Hold:**
  - **@astrojs/node (as Production Adapter):** Restricted strictly to the Render test environment (`RENDER=true`). Must never be used for production deploys.

## 2. Infrastructure & Cloud

- **Adopt:**
  - **Cloudflare Workers + Assets (`wrangler.jsonc`):** Unified Workers-First edge deployment model with `ASSETS` static binding.
  - **Cloudflare KV (`CHAT_STORE`):** Key-value edge storage for persistence and state caching.
  - **Sentry (`@sentry/cloudflare`, `@sentry/astro`):** Error monitoring and performance tracing.
- **Trial:**
  - **PostHog Telemetry (`posthog-js`):** Web analytics with dynamic dynamic-import deferred loading.
- **Assess:**
  - **Cloudflare D1 / Vectorize:** Edge SQL and vector indexing for dynamic search capabilities.
- **Hold:**
  - **Legacy Cloudflare Pages (`_routes.json`, Pages functions):** Replaced by unified Workers + Assets architecture.

## 3. Tooling & AI Workflows

- **Adopt:**
  - **Vitest:** Unit testing runner for tests and coverage checks.
  - **Prettier & ESLint:** Mandatory code formatting and static analysis checks.
  - **Husky & lint-staged:** Git hooks enforcing pre-commit verification.
  - **MCP Servers (`mcp_config.json`):** Model Context Protocol integrations (`astro-docs`, `render`, `context7`).
  - **Autonomous AI Agents (Prism, Sentinel, Jules, Vantage, Palette, Docu, Janitor, Kinetic, Apex, StuntDouble, Bolt, Content, Aurora, Archie, Scribe, ObservabilityClerk):** Multi-agent autonomous evolution system.
- **Trial:**
  - **Codecov Vite Plugin:** Bundle analysis and test coverage reporting plugin.
- **Assess:**
  - **Playwright:** End-to-end visual regression testing framework.
- **Hold:**
  - **Direct Git Writes to Protected `main` in CI:** CI must create GitHub releases without writing generated artifacts back to `main`.

## 4. Patterns & Architecture

- **Adopt:**
  - **Static Pre-Rendering (`output: "static"`):** Default rendering strategy for high speed and SEO.
  - **Strict Zod Schema Validation:** Compile-time and runtime validation at all system boundaries (`docs/zod-guidelines.md`).
  - **Vanilla CSS (Zero Framework):** Pure CSS styling with custom properties and glassmorphic aesthetic.
  - **Single-Pass Array Traversal:** Zero-allocation performance patterns for edge runtime SSR utilities.
- **Trial:**
  - **Feature Flags (`src/content/flags/config.json`):** Scoped runtime feature isolation for new capabilities.
- **Assess:**
  - **Edge SSR Response Streaming:** Real-time streaming for edge AI responses.
- **Hold:**
  - **Tailwind CSS / Heavy JS Animation Libraries:** Prohibited; maintain Vanilla CSS and pure Web APIs.
  - **`any` / `@ts-ignore` Suppressions:** Strictly forbidden across the codebase.
