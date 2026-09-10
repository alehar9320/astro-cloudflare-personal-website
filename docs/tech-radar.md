# Repository Tech Radar

## Quadrants & Technologies

### 1. Frameworks & Runtimes

- **Adopt:**
  - **Astro (v4+)**: Core SSG framework for building fast, content-focused pages.
  - **Cloudflare Workers Edge Runtime**: High-performance distributed JS runtime powering production.
  - **TypeScript (Strict Mode)**: Mandatory static typing for safety and AI predictability.
- **Trial:**
  - **`@astrojs/node`**: Node standalone server adapter used strictly as an isolated test environment on Render.
- **Assess:**
  - **Dynamic Import Code Splitting**: Deferred loading of client-side dynamic chunks (e.g., telemetry libraries).
- **Hold:**
  - **Client-Side Heavy Frameworks (React, Vue, Svelte)**: Keep core UI strictly in Astro and Vanilla JS/CSS to minimize bundle overhead.
  - **Node.js Production Server**: Production runs on Cloudflare Workers only.

---

### 2. Infrastructure & Cloud

- **Adopt:**
  - **Cloudflare Workers + Assets (`wrangler.jsonc`)**: Unified Workers-first deployment architecture.
  - **Cloudflare KV (`CHAT_STORE`)**: Edge key-value store for lightweight persistent state.
  - **Cloudflare Workers AI (`AI`)**: Direct LLM invocation on edge runtime without external API latency.
- **Trial:**
  - **Render Web Services (`render.yaml`)**: Secondary Node debugging environment for Google Jules.
- **Assess:**
  - **Cloudflare D1 / Vectorize**: SQLite / Vector database options for future structured search or RAG.
- **Hold:**
  - **Legacy Cloudflare Pages (`_routes.json`, `functions/`)**: Phased out in favor of Workers + Assets binding.
  - **External Serverless Functions (Vercel / AWS Lambda)**: Consolidated on Cloudflare edge stack.

---

### 3. Tooling & AI Workflows

- **Adopt:**
  - **Vitest**: Native Unit/Integration testing runner.
  - **Prettier & ESLint**: Automated code formatting and style enforcement.
  - **Zod**: Runtime schema validation for content collections and API payloads.
  - **GitHub Actions**: Automated CI quality gates and tag-driven GitHub Releases (`scripts/release.js`).
- **Trial:**
  - **MCP Servers**: Context and tooling servers configured in `mcp_config.json` (`astro-docs`, `render`, `context7`).
- **Assess:**
  - **Codecov Vite Plugin**: Automated bundle analysis and coverage telemetry integration.
- **Hold:**
  - **Tailwind CSS & Utility CSS Frameworks**: Banned in favor of modular Vanilla CSS and 'Northern Lights' glassmorphic tokens.
  - **Direct Writes to Protected `main`**: All changes must pass through CI pull request verification.

---

### 4. Patterns & Architecture

- **Adopt:**
  - **Workers-First Routing**: Route execution owned by `src/cloudflare-worker.ts` and `wrangler.jsonc`.
  - **Static Pre-Rendering**: Default static output (`output: "static"`) with targeted server endpoints.
  - **Vanilla CSS Glassmorphism**: 'Northern Lights' theme and frosted glass styling.
  - **Module-Level Static RegExp Hoisting**: Performance standard for edge utilities.
  - **Single-Pass Edge Data Transforms**: Optimized `for...of` array traversals to minimize GC on Workers.
- **Trial:**
  - **DOM MutationObserver State Guarding**: Synchronizing UI state with `localStorage` without redundant disk I/O.
- **Assess:**
  - **Pointer-Based Character Traversal Parsers**: Memory-efficient string scanning without regex allocation overhead.
- **Hold:**
  - **Global Client State Libraries (Redux, Zustand)**: Banned; rely on native Web APIs or URL state.
  - **Unsanitized HTML Interpolation (`set:html`)**: Banned unless source content is 100% trusted and validated via Zod.

---

## Rings Summary

- **Adopt:** High confidence, production-proven in this repo. Default choice for new work.
- **Trial:** High potential with low risk. Ready for isolated usage in minor features or scripts.
- **Assess:** Worth tracking and evaluating trade-offs; not yet recommended for active production code.
- **Hold:** Phasing out or proven problematic in our setup. Do not use for new work.
