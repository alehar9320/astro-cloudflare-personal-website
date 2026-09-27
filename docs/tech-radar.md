# Repository Tech Radar

This Tech Radar tracks technologies, runtime choices, tools, and architectural patterns evaluated and adopted across Alexander Härenstam's personal portfolio repository (`molecular-mars`). It serves as ground-truth context for human developers and autonomous AI agents.

---

## Quadrants & Technology Rings

### 1. Frameworks & Runtimes

- **Adopt**
  - **Astro (v4+):** Primary web framework for static site generation and component architecture (`astro.config.mjs`).
  - **TypeScript (Strict Mode):** Core language standard ensuring strict type checking across build scripts and components (`tsconfig.json`).
  - **Cloudflare Workers Edge Runtime:** Runtime execution target for production deployments (`wrangler.jsonc`, `src/cloudflare-worker.ts`).

- **Trial**
  - **Node.js Standalone Adapter (`@astrojs/node`):** Secondary build mode (`RENDER=true`) isolated specifically for agent sandbox testing on Render.

- **Assess**
  - **Cloudflare Workers AI:** Potential edge AI capability integration; currently mocked/stubbed in Node runtime.

- **Hold**
  - **Deprecated Cloudflare Pages Adapter:** Banned in favor of Unified Workers + Assets binding model.
  - **Dynamic Node Server for Production:** Production traffic must strictly run on Cloudflare Workers edge runtime.

---

### 2. Infrastructure & Cloud

- **Adopt**
  - **Cloudflare Workers + Static Assets:** Unified production infrastructure providing global edge hosting (`wrangler.jsonc`).
  - **GitHub Actions:** CI pipeline executing lint, format, unit tests, and build checks (`.github/workflows/ci.yml`).
  - **Sentry (`@sentry/astro`):** Client & edge error monitoring (`sentry.client.config.ts`, `sentry.server.config.ts`).

- **Trial**
  - **Cloudflare KV / D1 / Vectorize:** Edge storage bindings for visit tracking and release summaries.

- **Assess**
  - **Cloudflare Hyperdrive / Durable Objects:** Edge database connections for advanced persistence if needed.

- **Hold**
  - **Manual Server Deployments:** Banned in favor of automated Cloudflare Git Integration deployment on `main`.

---

### 3. Tooling & AI Workflows

- **Adopt**
  - **Vitest:** Primary unit testing framework (`vitest.config.ts`).
  - **ESLint & Prettier:** Automated code formatting and static linting compliance.
  - **Model Context Protocol (MCP):** AI integration endpoints for repository analysis (`mcp_config.json`, `docs/mcp.md`).
  - **Jules Autonomous Agent System:** Scheduled autonomous agents operating within strictly defined agent scopes (`.Jules/`).

- **Trial**
  - **Codecov Vite Plugin:** Code coverage reporting plugin integrated into Vite (`astro.config.mjs`).

- **Assess**
  - **Playwright E2E:** Visual regression testing and browser automation verification.

- **Hold**
  - **Unvalidated Agent Artifact Folders:** Banned creation of non-standard agent directories at root (e.g. `.Aurora`, `.jules`). All agent journals MUST reside strictly in `.Jules/`.

---

### 4. Patterns & Architecture

- **Adopt**
  - **Static Pre-Rendering with Island Hydration:** Default static HTML generation with client hydration strictly where interactive (`output: 'static'`).
  - **Static Feature Flags via Content Collections:** Zero-dependency, type-safe feature toggling in `src/content/flags/config.json` validated via Zod schema (`ADR 0002`).
  - **Strict Zod Schema Validation:** Mandatory compile-time and runtime validation for all content collections and API payloads (`docs/zod-guidelines.md`).
  - **Vanilla CSS Glassmorphism:** Scoped CSS with custom properties and backdrop filters ("Northern Lights" aesthetic).

- **Trial**
  - **Cubic Smoothstep Falloff for Canvas Refraction:** Pointer-driven canvas displacement without heavy external animation libraries.

- **Assess**
  - **Web Workers Offloading:** Offloading intensive canvas or background computations to Web Workers.

- **Hold**
  - **Tailwind CSS / Heavy CSS Frameworks:** Banned in favor of Vanilla CSS.
  - **Heavy 3D Asset Libraries (Three.js / GLTF):** Banned to protect LCP/INP web vitals.
  - **Direct Dynamic Database Writes on Client-Side:** Banned without edge API validation boundaries.
