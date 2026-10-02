# Repository Tech Radar

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

## Radar Entries

### 1. Frameworks & Runtimes

- **Astro (v5+) [Adopt]:** Primary web framework for static site generation with island hydration capability.
- **TypeScript [Adopt]:** Strictly typed codebase baseline (`tsconfig.json`).
- **Cloudflare Workers / Edge Runtime [Adopt]:** Primary production execution target (`wrangler.jsonc`, `@astrojs/cloudflare`).
- **Node.js Server (`@astrojs/node`) [Trial]:** Secondary standalone Node server mode reserved strictly for isolated test environments (e.g., Render Jules test environment).

### 2. Infrastructure & Cloud

- **Cloudflare Pages / Workers [Adopt]:** Primary production hosting infrastructure.
- **Cloudflare KV / AI Bindings [Adopt]:** Native edge key-value storage and Cloudflare Workers AI integration for dynamic features.
- **Render [Trial]:** Jules test environment for isolated server-side debugging.
- **Legacy Docker Containers [Hold]:** Avoid containerized deployments for core application serving in favor of serverless edge primitives.

### 3. Tooling & AI Workflows

- **Vitest [Adopt]:** Unit and API integration test runner (`npm run test`).
- **ESLint & Prettier [Adopt]:** Code style, formatting, and AST linting rules (`npm run lint`, `npm run format`).
- **Sentry (`@sentry/astro`, `@sentry/cloudflare`) [Adopt]:** Error logging and telemetry tracking across client and edge runtimes.
- **Autonomous AI Agents (Jules, Archie, Kinetic, Vantage, etc.) [Adopt]:** Role-based AI agents following `.aiconfig.md`, memory standards, and explicit ADR directives.

### 4. Patterns & Architecture

- **Static Feature Flags via Content Collections [Adopt]:** Zod-validated static JSON feature toggles (`src/content/flags/config.json` & `src/content.config.ts`, ADR 0002).
- **Northern Lights Design System [Adopt]:** Vanilla CSS glassmorphic aesthetic with dark blue/cyan gradients and responsive design primitives.
- **Architecture Decision Records (ADRs) [Adopt]:** Sequential architectural governance documents in `docs/adr/`.
- **Experimental Laboratory Isolation [Adopt]:** Non-production visual experiments isolated in `src/pages/lab/` or `src/pages/experimental/`.
- **Global CSS Frameworks / Tailwind [Hold]:** Strictly prohibited; all styling must use scoped Vanilla CSS and design tokens.
