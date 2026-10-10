# Repository Tech Radar

This Tech Radar tracks technologies, frameworks, infrastructure, tools, and architectural patterns used or evaluated for Alexander Härenstam's personal portfolio repository.

## Quadrants

1. **Frameworks & Runtimes**
2. **Infrastructure & Cloud**
3. **Tooling & AI Workflows**
4. **Patterns & Architecture**

## Rings

- **Adopt:** High confidence, production-proven in this repository. Default choice for new work.
- **Trial:** High potential with low risk. Ready for isolated usage in minor features, experimental routes, or scripts.
- **Assess:** Worth tracking and evaluating trade-offs; not yet recommended for active production code.
- **Hold:** Phasing out or proven problematic in our setup. Do not use for new work.

---

## 1. Frameworks & Runtimes

- **Adopt:**
  - **Astro 5:** Modern static-first web framework powering page generation and client island hydration.
  - **TypeScript 5:** Strict type safety across all components, APIs, and test suites.
  - **Cloudflare Workers Runtime:** Edge execution environment for dynamic Worker API endpoints (`/api/chat`, `/api/visits`, `/api/releases`).
- **Trial:**
  - **Node 22 Standalone (`@astrojs/node`):** Node standalone server runtime used exclusively when `RENDER=true` for Google Jules test environment execution.
- **Assess:**
  - **Cloudflare Workflows:** Durable execution engine for background task workflows and automated data synchronization.
- **Hold:**
  - **Express.js / Traditional Node Web Servers:** Heavy Node server frameworks in production; production is strictly Cloudflare Workers.

## 2. Infrastructure & Cloud

- **Adopt:**
  - **Cloudflare Workers + Assets Binding:** Primary production hosting and static asset CDN distribution (`wrangler.jsonc`).
  - **Cloudflare Workers KV (`CHAT_STORE`):** Key-Value storage for chat session persistence and visit metadata.
  - **Cloudflare Workers AI (`AI`):** Edge LLM inference for portfolio interactive assistant queries.
- **Trial:**
  - **Render Services:** Hosted Node test environment dedicated to Google Jules agent verification (`render.yaml`).
- **Assess:**
  - **Cloudflare D1:** Serverless SQL database for structured relational query needs at the edge.
- **Hold:**
  - **AWS S3 / Traditional VPS Hosting:** Complex cloud infrastructure setups replaced by unified Cloudflare Workers edge bindings.

## 3. Tooling & AI Workflows

- **Adopt:**
  - **Vitest:** Fast unit testing runner for logic utilities, schemas, and API handlers.
  - **ESLint (Flat Config) & Prettier:** Code formatting and linting enforcing repository code style.
  - **Wrangler CLI:** Local worker simulation, type generation (`generate-types`), and deployment tooling.
  - **Autonomous AI Agents (Jules, Bolt, Kinetic, Sentinel, Apex, etc.):** Specialised role-based agents for continuous repository evolution.
- **Trial:**
  - **Playwright:** End-to-end browser verification and visual UI testing scripts.
- **Assess:**
  - **Codecov Vite Plugin:** Automated bundle size analysis and test coverage tracking integration.
- **Hold:**
  - **Jest / Webpack / Babel:** Legacy build and test toolchains superseded by Vite, Vitest, and Astro.

## 4. Patterns & Architecture

- **Adopt:**
  - **Static Pre-Rendering with Edge Assets:** Pre-rendered HTML output with Cloudflare Workers Assets binding (ADR 0002).
  - **Zod Frontmatter & Input Validation:** Strict runtime schema validation in `content.config.ts` and API handlers.
  - **Vanilla CSS with Northern Lights Theme:** Scoped CSS with CSS custom properties, hardware acceleration, and glassmorphism.
  - **ISO-8601 String Slicing (`slice(0, 10)`):** Memory-efficient date string extraction avoiding intermediate string array allocations.
  - **Ambient Node Global Declarations in `env.d.ts`:** Clean `astro check` type validation for test utilities.
- **Trial:**
  - **Experimental Route Isolation (`src/pages/experimental/`):** Isolated feature prototyping behind feature flags or experimental routes.
- **Assess:**
  - **Edge Stream Caching:** Caching streaming responses for common interactive assistant prompts.
- **Hold:**
  - **Third-Party CSS Frameworks (Tailwind, Bootstrap):** External styling dependencies forbidden in favor of Vanilla CSS and design tokens.
  - **Heavy Client JS Animation Libraries (Framer Motion, GSAP):** Complex JS runtime animation frameworks that degrade performance or CLS.
