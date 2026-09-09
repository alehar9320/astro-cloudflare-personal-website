# Repository Tech Radar

The Tech Radar reflects established technology choices, active explorations, and forbidden anti-patterns across Alexander Härenstam's personal portfolio repository, governed by **Archie** (Chief Architect Agent).

## Quadrants & Rings

### 1. Frameworks & Runtimes

- **Adopt:**
  - **Astro (v4+):** Primary framework for static pre-rendering, content collections, and zero-JS layout rendering.
  - **TypeScript (Strict Mode):** Mandatory typed runtime contract across all source files and utility scripts.
  - **Cloudflare Workers Edge Runtime:** Production target runtime executing static assets and edge workers.
- **Trial:**
  - **Node.js 22+ (Render Test Env):** Isolated Node server runtime used strictly by AI agents for evaluation/debugging (`render.yaml`).
- **Assess:**
  - **Cloudflare Workers AI & KV:** Potential edge state and LLM inference integrations for future interactive capabilities.
- **Hold:**
  - **Client-Side SPA Frameworks (React, Vue, Svelte):** Banned for core page rendering to preserve zero-bundle performance.

---

### 2. Infrastructure & Cloud

- **Adopt:**
  - **Cloudflare Workers + Assets (Unified Architecture):** Canonical production hosting and edge routing via `wrangler.jsonc`.
  - **GitHub Actions CI/CD:** Automated linting, verification pipelines, and release generation.
- **Trial:**
  - **Render Web Service (`render.yaml`):** Standalone Node environment for test suite verification.
- **Assess:**
  - **Cloudflare D1 / Hyperdrive:** Reserved for potential future dynamic storage requirements.
- **Hold:**
  - **Legacy Cloudflare Pages Routing (`_routes.json`):** Phased out in favor of the unified Workers + Assets architecture.
  - **Direct Production Deploy Scripts in CI:** Phased out; Cloudflare Git integration owns production deployments.

---

### 3. Tooling & AI Workflows

- **Adopt:**
  - **Vitest:** Lightweight unit testing framework for helper utilities and parsers.
  - **Prettier & ESLint:** Code style and syntax quality enforcement.
  - **Zod (v4+):** Mandatory schema validation for content collections, environmental variables, and API contracts.
  - **Husky & lint-staged:** Pre-commit formatting guardrails.
  - **Autonomous Agents (Jules, Sentinel, Vantage, Palette, Docu, Engine, Janitor, Kinetic, Apex, StuntDouble, ObservabilityClerk, Archie):** Specialized AI developer persona automation.
- **Trial:**
  - **Sentry Astro / Cloudflare SDKs:** Error reporting and telemetry instrumentation.
  - **PostHog JS:** Privacy-conscious dynamic analytics.
- **Assess:**
  - **Model Context Protocol (MCP) Servers:** Local contextual servers (`mcp_config.json`) for agent codebase augmentation.
- **Hold:**
  - **Tailwind CSS & CSS Framework CLI tools:** Prohibited to maintain pure Vanilla CSS architecture.

---

### 4. Patterns & Architecture

- **Adopt:**
  - **Static Pre-rendering (`output: "static"`):** Default generation model for maximum performance and zero CLS.
  - **Pure Vanilla CSS:** Scoped styling without external CSS frameworks or dynamic CSS-in-JS runtimes.
  - **Workers-First Binding Pattern:** Declarative asset and edge route handling via `wrangler.jsonc`.
  - **Module-Level Static RegExp Hoisting:** Micro-optimization for edge request utility functions.
- **Trial:**
  - **Feature Flag Isolation (`src/content/flags/`):** Gating experimental features under lean JSON configurations.
- **Assess:**
  - **Edge Dynamic SSR Islands:** Selective server-side rendering for future dynamic interactive endpoints.
- **Hold:**
  - **Global State Libraries (Redux, Zustand, MobX):** Banned; rely on native Web APIs or URL state where needed.
  - **Inline Style Injection / Unsanitized `set:html`:** Prohibited due to security and maintainability risks.
