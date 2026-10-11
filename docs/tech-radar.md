# Repository Tech Radar

This Tech Radar provides explicit ground-truth context for human developers and autonomous AI agents working on Alexander Härenstam's personal portfolio repository.

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

### Adopt

- **Astro (`astro`)**: Static-first web framework powering page compilation and content collections.
- **TypeScript**: Strict static type system across application code, Worker handlers, and tests.
- **Node.js (>=22.12.0)**: Local build environment and server runtime for Render test environment.

### Hold

- **React / Vue / Svelte**: Client-side UI frameworks are omitted in favor of lightweight native Astro components and vanilla Web APIs.
- **Tailwind CSS**: Utility-first CSS frameworks are omitted in favor of native CSS custom properties and scoped Vanilla CSS ("Northern Lights" aesthetic).

---

## 2. Infrastructure & Cloud

### Adopt

- **Cloudflare Workers**: Primary production runtime serving static assets via `ASSETS` binding and routing API requests (`src/cloudflare-worker.ts`).
- **Cloudflare Workers KV (`CHAT_STORE`)**: Edge key-value store for lightweight chat persistence.
- **Cloudflare Workers AI (`AI`)**: Edge AI model binding powering serverless chat endpoints.

### Trial

- **Render (`render.yaml`)**: Node.js server test environment for Google Jules debugging (`isRender = true` in `astro.config.mjs`).

---

## 3. Tooling & AI Workflows

### Adopt

- **Vitest**: Fast Unit testing framework for utility functions, API handlers, and schema context validation.
- **Prettier & ESLint**: Automated code formatting and linting (`npm run format`, `npm run lint`).
- **Sentry (`@sentry/astro`, `@sentry/cloudflare`)**: Error monitoring and telemetry across web and worker runtimes.
- **Husky & lint-staged**: Git pre-commit hooks enforcing formatting and linting checks.

### Trial

- **PostHog**: Privacy-aware user analytics loaded dynamically during browser idle callbacks (`src/components/PostHog.astro`).

---

## 4. Patterns & Architecture

### Adopt

- **Static Pre-Rendering (`output: 'static'`)**: Compiling pages to static assets at build time (ADR 0002).
- **Cloudflare Workers-First Production**: Production target strictly bound to Cloudflare Workers with Assets binding (ADR 0001).
- **Zod Schema Validation**: Strict input and content collection schema validation (`src/content.config.ts`).
- **Hoisting Stateless Utilities**: Hoisting `Intl.DateTimeFormat`, `TextEncoder`, and regex matchers to module level to eliminate allocation overhead.

### Hold

- **Full Server-Side Rendering (`output: 'server'`)**: Global SSR for production is held in favor of static pre-rendering with targeted Worker API endpoints.
- **3rd-Party UI / Animation Libraries**: Heavy client JS libraries (e.g. Framer Motion, GSAP) are held in favor of hardware-accelerated CSS transforms and transitions.
