# Repository Tech Radar

This document serves as the ground-truth technical radar for Alexander Härenstam's portfolio repository, maintained by the Autonomous Chief Architect (Archie).

## Structure & Categories

### Quadrants

1. **Frameworks & Runtimes:** Core web application frameworks, runtime environments, and language platforms.
2. **Infrastructure & Cloud:** Edge hosting platforms, serverless asset distribution, and runtime bindings.
3. **Tooling & AI Workflows:** Build tools, formatters, type checkers, test frameworks, and autonomous agent systems.
4. **Patterns & Architecture:** Structural design decisions, state management, schema validation, and rendering strategies.

### Rings

- **Adopt:** High confidence, production-proven in this repository. Default choice for new work.
- **Trial:** High potential with low risk. Proven in isolated test environments or experimental routes.
- **Assess:** Under evaluation for architectural fit; not yet adopted in core production code.
- **Hold:** Phased out, problematic, or explicitly banned in this repository setup. Do not use for new work.

---

## Tech Radar Matrix

### 1. Frameworks & Runtimes

- **Adopt:**
  - **Astro (v7+):** Primary web framework for static site rendering and content hydration.
  - **Cloudflare Workers:** Production runtime environment for edge execution and server endpoints.
  - **TypeScript:** Strict type system across all application logic, endpoints, and utility modules.
- **Trial:**
  - **@astrojs/node Standalone Server:** Used strictly for isolated Jules AI test debugging in Render (`RENDER=true`). Not production.
- **Hold:**
  - **Client-heavy JS UI Frameworks (React/Vue/Svelte):** Banned for core pages to maintain zero-JS static HTML baseline performance.

### 2. Infrastructure & Cloud

- **Adopt:**
  - **Cloudflare Workers + Assets (`env.ASSETS`):** Static asset hosting and edge routing model (ADR 0002).
  - **Cloudflare KV & Analytics Engine:** Serverless key-value storage and telemetry event logging.
- **Hold:**
  - **Render Node.js Server Production Hosting:** Decommissioned/Hold for production; replaced by Cloudflare Workers (ADR 0001).

### 3. Tooling & AI Workflows

- **Adopt:**
  - **Vitest:** Unit and integration testing suite for utilities, helpers, and API endpoints.
  - **Prettier & ESLint:** Code formatting and linting standard enforcement.
  - **Astro Check:** Static type checking for `.astro` components and content schemas.
  - **Zod:** Runtime and build-time schema validation for frontmatter, API endpoints, and feature flags.
  - **Autonomous AI Agents (Archie, Bolt, Jules, Sentinel, etc.):** Task-focused autonomous agent workflows operating under strict directives.

### 4. Patterns & Architecture

- **Adopt:**
  - **Static Pre-Rendering (`output: 'static'`):** Default build strategy for zero cold-start global page delivery.
  - **Astro Content Collections with Zod Schemas:** Centralized schema validation in `src/content.config.ts` (ADR 0003).
  - **Static JSON Feature Flags:** Isolated toggles in `src/content/flags/*.json` with `z.boolean().default(false)` defaults.
  - **Astro Server Endpoints:** Dynamic API handlers in `src/pages/api/*.ts` delegated by `src/cloudflare-worker.ts`.
- **Hold:**
  - **Unvalidated Frontmatter / Direct FS Imports:** Replaced by Astro Content Collections and Zod schemas.
  - **3rd-Party Animation Frameworks (Framer Motion, GSAP):** Banned in favor of vanilla CSS transitions and hardware-accelerated transforms.
  - **3rd-Party UI Frameworks / Tailwind CSS:** Banned in favor of scoped native CSS and global tokens.
