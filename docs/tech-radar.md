# Repository Tech Radar

This document maintains the technical trajectory and ground-truth technology choices for Alexander Härenstam's portfolio codebase. It guides both human developers and autonomous AI agents on adopted tools, emerging trials, and anti-patterns on hold.

---

## Rings Legend

- **Adopt:** High confidence, production-proven in this repo. Default choice for new work.
- **Trial:** High potential with low risk. Ready for isolated usage in experimental routes (`src/pages/experimental/`) or feature flags.
- **Assess:** Worth tracking and evaluating trade-offs; not yet recommended for active production code.
- **Hold:** Phasing out or forbidden in our setup. Do not use for new work.

---

## Quadrants

### 1. Frameworks & Runtimes

- **Adopt:**
  - **Astro (v4+):** Primary framework for static pre-rendering, component composition, and content collection management.
  - **TypeScript (Strict Mode):** Mandatory type system across all application logic, utilities, and scripts.
  - **Cloudflare Workers Edge Runtime:** Production execution platform for serverless API routes (`src/pages/api/`).
- **Trial:**
  - **@astrojs/node:** Used strictly for Google Jules sandbox testing when `RENDER=true` (`src/env/cloudflare-workers.node.ts`).
- **Assess:**
  - **WebGPU / Canvas APIs:** Native browser graphics capabilities for lightweight interactive lab components (`src/pages/lab/`).
- **Hold:**
  - **Tailwind CSS / CSS Frameworks:** Banned in favor of Vanilla CSS and scoped Astro component styles.
  - **Heavy Client JS Frameworks (React/Vue/Svelte):** Avoided to maintain zero-JS static HTML defaults wherever passive CSS suffices.

---

### 2. Infrastructure & Cloud

- **Adopt:**
  - **Cloudflare Workers + Assets (`wrangler.jsonc`):** Unified deployment model serving static assets and edge API endpoints.
  - **Cloudflare Workers KV:** Edge key-value store for visit statistics and cached release data.
  - **Workers AI:** Edge LLM inference binding for personal interactive chat features.
- **Trial:**
  - **Render Standalone Service:** Dedicated Jules test environment via `render.yaml`.
- **Assess:**
  - **Cloudflare Vectorize / D1:** Vector database and relational edge storage for future semantic search or context retrieval.
- **Hold:**
  - **Legacy Cloudflare Pages Models:** Superseded by the unified Workers + Assets architecture (`wrangler.jsonc`).
  - **Parallel Manual Production Deployments:** Production builds are owned exclusively by Cloudflare Git integration on `main`.

---

### 3. Tooling & AI Workflows

- **Adopt:**
  - **Vitest:** Native unit and integration testing runner.
  - **Prettier & ESLint:** Code formatting and quality linter suite.
  - **Model Context Protocol (MCP):** Standard protocol for AI context extensions (`mcp_config.json`, `docs/mcp.md`).
  - **Jules Scheduled Agents:** Specialized autonomous sub-agent network operating under `.Jules/` journals.
- **Trial:**
  - **Zod Guidelines Enforcement:** Static Zod schema validation rules documented in `docs/zod-guidelines.md`.
- **Assess:**
  - **Custom MCP Server Extensions:** Local tools expanding repository context retrieval.
- **Hold:**
  - **Global Root AI Directories (`.jules`, `.Aurora`, `.Pruning`):** Banned in favor of unified `.Jules/` location.
  - **Direct Main Branch Writes by Automation:** Release automation must not commit generated release files directly back to protected `main`.

---

### 4. Patterns & Architecture

- **Adopt:**
  - **Static Pre-Rendering (`output: "static"`):** Default rendering strategy for sub-millisecond page delivery and optimal SEO.
  - **Zod Schema Validation:** Mandatory compile-time and runtime validation for content collections, API inputs, and environment configurations.
  - **Scoped Vanilla CSS & Glassmorphism:** Theme-consistent 'Northern Lights' aesthetic using custom CSS properties.
  - **WCAG 2.1 AA Accessibility:** Mandatory focus states, minimum touch target dimensions (44x44px), and forced-colors media query support.
- **Trial:**
  - **Feature Flags (`src/content/flags/config.json`):** Static configuration flags isolating new MVP enhancements.
- **Assess:**
  - **Pointer-Based String Scanning for Edge Utilities:** Optimizing edge runtime parsing by avoiding dynamic array allocations.
- **Hold:**
  - **Dynamic Server-Side Rendering (`output: "server"`):** Banned globally to prevent performance regressions on core static pages.
  - **Third-Party Styling / Utility Libraries:** Banned to preserve lean bundle footprints.
