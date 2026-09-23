# Repository Tech Radar

This Tech Radar reflects the architectural choices, tools, frameworks, and patterns active across Alexander Härenstam's personal portfolio repository (`molecular-mars`).

## Rings

- **Adopt:** High confidence, production-proven in this repo. Default choice for new work.
- **Trial:** High potential with low risk. Ready for isolated usage in minor features or scripts.
- **Assess:** Worth tracking and evaluating trade-offs; not yet recommended for active production code.
- **Hold:** Phasing out or proven problematic in our setup. Do not use for new work.

---

## Quadrants

### 1. Frameworks & Runtimes

- **Astro (v4+)** [`Adopt`]: Core SSG framework powering static page generation and content collections.
- **TypeScript (Strict Mode)** [`Adopt`]: Mandatory static typing across all components, API routes, and utility functions.
- **Cloudflare Workers Edge Runtime** [`Adopt`]: Production edge execution environment for dynamic routes and asset serving.
- **Node.js Standalone Runtime** [`Trial`]: Secondary runtime path used strictly in `render.yaml` for Jules test/debug execution (`RENDER=true`).

### 2. Infrastructure & Cloud

- **Cloudflare Workers + Assets** [`Adopt`]: Unified edge asset binding (`wrangler.jsonc`) replacing legacy Cloudflare Pages setups.
- **Workers KV (`CHAT_STORE`)** [`Adopt`]: Production edge storage binding for persistent chat session context and visit metrics.
- **Workers AI (`AI`)** [`Adopt`]: Edge AI inference binding powering interactive AI features.
- **Render (Jules Test Target)** [`Trial`]: Isolated staging/testing environment for Google Jules debugging.
- **Legacy Cloudflare Pages Deployments** [`Hold`]: Phased out in favor of the unified Workers + Assets architecture.

### 3. Tooling & AI Workflows

- **Vitest** [`Adopt`]: Core unit and API test runner providing fast execution and mock capabilities.
- **Prettier & ESLint** [`Adopt`]: Code style, formatting, and linting rules enforced on every commit.
- **Sentry (@sentry/astro)** [`Adopt`]: Client/server error tracking and telemetry monitoring.
- **Codecov** [`Adopt`]: Test coverage analysis integrated with Vite build pipeline.
- **Jules Autonomous Agent Network** [`Adopt`]: Specialized AI sub-agents (e.g., Archie, Vantage, Bolt, Kinetic) governing quality and strategy under `.Jules/`.

### 4. Patterns & Architecture

- **Static Pre-Rendering (`output: "static"`)** [`Adopt`]: Default rendering pattern ensuring high Performance and Core Web Vitals scores.
- **Zod Schema Validation** [`Adopt`]: Type-safe compile-time and runtime validation for content collections and API payloads.
- **Scoped Vanilla CSS & Glassmorphism** [`Adopt`]: Zero-dependency custom styling maintaining the 'Northern Lights' theme without CSS frameworks.
- **Module-Level Constant Hoisting** [`Adopt`]: Pre-allocation of RegExp, DateTimeFormat, and column maps to eliminate edge GC overhead.
- **Tailwind CSS & Heavy CSS Frameworks** [`Hold`]: Banned to preserve minimalist bundle size and strict Vanilla CSS architecture.
- **Dynamic Direct Writes to Protected `main`** [`Hold`]: Prohibited in CI/CD workflows; releases are published strictly via GitHub releases.
