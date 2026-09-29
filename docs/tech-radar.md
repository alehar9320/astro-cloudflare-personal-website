# Repository Tech Radar

This Tech Radar tracks technologies, frameworks, and patterns used across the repository. It serves as ground-truth context for both human developers and autonomous AI agents.

## Quadrants

1. **Frameworks & Runtimes**
2. **Infrastructure & Cloud**
3. **Tooling & AI Workflows**
4. **Patterns & Architecture**

---

## Rings

### 1. Frameworks & Runtimes

- **Adopt:**
  - **Astro (v5+):** Primary web framework for static site generation and edge rendering.
  - **TypeScript:** Mandatory strict type system across all application and test code.
  - **Cloudflare Workers / Pages:** Primary edge runtime environment (`@astrojs/cloudflare`).
- **Trial:**
  - **Node.js (v22+ LTS Standalone):** Secondary execution target reserved strictly for Jules sandbox verification and local debugging.
- **Assess:**
  - **WebGPU / HTML5 Canvas:** Evaluated by Prism agent for interactive digital art and lightweight animations.
- **Hold:**
  - **React / Vue / Heavy UI Frameworks:** Avoid introducing SPA/component frameworks; leverage native Astro islands and Vanilla Web APIs instead.

### 2. Infrastructure & Cloud

- **Adopt:**
  - **Cloudflare Pages / Workers Edge:** Edge hosting platform hosting https://me.alehar.workers.dev/.
  - **`public/_headers` Directives:** Immutable static asset caching rules automatically merged into Cloudflare deployment headers.
- **Trial:**
  - **Render (Node Server):** Isolated sandbox environment for autonomous agent verification (`render.yaml`).
- **Assess:**
  - **Cloudflare Workers KV / D1:** Edge storage bindings for prospective dynamic features.
- **Hold:**
  - **AWS / GCP Monolithic VM Infrastructure:** Avoid traditional monolithic backend hosts for static/edge delivery.

### 3. Tooling & AI Workflows

- **Adopt:**
  - **Vitest:** Primary fast unit testing runner.
  - **Prettier & ESLint:** Unified code formatting and linting rules enforced via Husky pre-commit hooks.
  - **Wrangler:** Cloudflare developer tooling for environment type generation and local deployment simulation.
  - **Jules & Specialized Agents (Apex, Bolt, Kinetic, Archie, etc.):** Autonomous AI agents following structured domain directives.
- **Trial:**
  - **Playwright:** End-to-end frontend visual verification script runner.
- **Assess:**
  - **Model Context Protocol (MCP):** Structured agent tool execution interface.
- **Hold:**
  - **Jest:** Phased out in favor of native Vite-powered Vitest execution.

### 4. Patterns & Architecture

- **Adopt:**
  - **Type-Safe Static Feature Flags:** JSON-backed flags validated strictly via Zod in Astro Content Collections (ADR 0002).
  - **Scoped Vanilla CSS & Glassmorphic UI:** Modular, zero-runtime dependency styling respecting the 'Northern Lights' aesthetic.
  - **WCAG 2.1 AA Accessibility Standards:** Strict 44x44px minimum touch targets and `@media (prefers-reduced-motion)` fallbacks.
  - **Module-Level Intl Hoisting:** Pre-instantiating Intl formatters at module scope for edge runtime GC optimization.
- **Trial:**
  - **Hardware-Accelerated Tactile Press Feedback:** Feature-flagged CSS transforms for responsive touch feedback.
- **Assess:**
  - **View Transitions (`astro:before-swap` / `astro:page-load`):** Dynamic SPA-like client routing with lifecycle cleanup.
- **Hold:**
  - **Global CSS Utility Frameworks (Tailwind, Bootstrap):** Strict preference for scoped Vanilla CSS to prevent global bundle bloat.
