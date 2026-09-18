# Repository Tech Radar

This Tech Radar tracks the technologies, tools, and architectural patterns used in Alexander Härenstam's personal portfolio repository. It serves as ground truth for human developers and autonomous AI agents.

## Rings

- **Adopt:** High confidence, production-proven in this repository. Default choice for all new features and updates.
- **Trial:** High potential with low risk. Ready for isolated usage in minor features or experimental routes.
- **Assess:** Worth tracking and evaluating trade-offs; not yet recommended for active production code.
- **Hold:** Phasing out or proven problematic in our setup. Do not use for new work.

---

## Quadrants

### 1. Frameworks & Runtimes

- **Adopt:**
  - **Astro (v5+)**: Core web framework for static site generation and SSR.
  - **Cloudflare Workers (`@astrojs/cloudflare`)**: Primary production edge runtime environment.
  - **TypeScript**: Enforced strict type safety across all components, scripts, and utilities.
- **Trial:**
  - **Node.js Server (`@astrojs/node`)**: Isolated agent test environment (Render build path).
- **Assess:**
  - **Cloudflare Workers AI / KV**: Targeted AI inference and key-value storage at the edge.
- **Hold:**
  - **Tailwind CSS / External CSS Frameworks**: Strictly forbidden; repository relies on zero-dependency Vanilla CSS.
  - **Client React / Vue / Svelte hydration frameworks**: High JS bundle cost; rely on native Web APIs and Astro island architecture.

### 2. Infrastructure & Cloud

- **Adopt:**
  - **Cloudflare Workers & Pages**: Primary deployment infrastructure (`wrangler.jsonc`).
- **Trial:**
  - **Render**: Jules automated testing host (Node server runner).
- **Assess:**
  - **Cloudflare D1 / Vectorize**: Edge relational database / vector search for potential knowledge retrieval features.
- **Hold:**
  - **Traditional VPS / Dedicated Servers**: Out of scope for edge-first static/SSR architecture.

### 3. Tooling & AI Workflows

- **Adopt:**
  - **npm**: Mandatory package manager (strictly no pnpm or yarn).
  - **Vitest**: Native Unit & Integration test runner.
  - **Prettier & ESLint**: Code formatting and linting engines.
  - **Husky & lint-staged**: Pre-commit validation hook pipeline.
  - **Zod**: Input parsing and content collection schema validation.
  - **Autonomous AI Agents (Sentinel, Kinetic, Apex, Archie, Vantage, etc.)**: Dedicated agent personas with strict role boundaries.
- **Trial:**
  - **Playwright**: End-to-end visual verification pipeline for frontend checks.
- **Assess:**
  - **Codecov Vite Plugin**: Coverage tracking integration.
- **Hold:**
  - **pnpm / yarn**: Banned package managers in this repo.
  - **`any` / `@ts-ignore`**: Prohibited escape hatches in TypeScript.

### 4. Patterns & Architecture

- **Adopt:**
  - **Workers-First Architecture**: SSR & Edge deployment via Cloudflare.
  - **Feature Flags (`src/content/flags/config.json`)**: Gating experimental or isolated features.
  - **Experimental Routes (`src/pages/experimental/`)**: Isolated route sandboxes for agent MVPs.
  - **Vanilla Scoped CSS & CSS Custom Properties**: Northern Lights visual theme styling.
  - **Zod Content Schema Validation**: Validation at boundaries for markdown/JSON content.
  - **ADR-Driven Architecture Governance**: Documenting architectural choices in `docs/adr/`.
- **Trial:**
  - **Canvas Micro-Interactions**: Client-side interactive canvas components with `astro:before-swap` cleanup hooks.
- **Assess:**
  - **Edge RAG / Knowledge Base Retrieval**: Searching localized context for interactive chat primitives.
- **Hold:**
  - **Global State Redux/Zustand Stores**: Over-engineered for minimalist static/SSR portfolio.
  - **Dynamic RegExp Instantiation in Loop / Edge Handlers**: Performance anti-pattern; static regular expressions must be hoisted.
