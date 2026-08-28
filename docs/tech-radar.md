# Repository Tech Radar

This Tech Radar tracks technologies, patterns, tools, and infrastructure decisions governing this repository. It serves as ground-truth context for human developers and autonomous AI agents.

## Quadrants

### 1. Frameworks & Runtimes

- **Adopt:**
  - **Astro (v7+)**: Static-first web framework powering the application front-end.
  - **TypeScript (v5+)**: Mandatory strictly-typed programming language.
  - **Cloudflare Workers**: Primary production runtime environment (`wrangler.jsonc`).
- **Trial:**
  - **Node.js Standalone (`@astrojs/node`)**: Isolated preview runtime used for Jules test environment (`RENDER=true`).
- **Assess:**
  - **Cloudflare Vectorize / Workers AI**: Potential edge AI integrations for context retrieval.
- **Hold:**
  - **Client-side UI Frameworks (React, Vue, Svelte)**: Keep bundle footprint lightweight with Vanilla JS/CSS; do not hydrated full client frameworks unless strictly necessary.

### 2. Infrastructure & Cloud

- **Adopt:**
  - **Cloudflare Pages / Workers + Assets**: Workers-First edge hosting model with automatic Git deployments.
  - **GitHub Actions**: Primary CI/CD validation pipeline and automated release tagger (`scripts/release.js`).
- **Trial:**
  - **Render**: Secondary test sandbox for automated agent web verification.
- **Assess:**
  - **Cloudflare KV / D1**: Lightweight edge data persistence layer.
- **Hold:**
  - **Manual SSH/FTP Server Deployments**: All deployments must go through automated edge Git hooks or CI workflows.

### 3. Tooling & AI Workflows

- **Adopt:**
  - **Vitest**: Native Vite unit testing framework for components, scripts, and schemas.
  - **Prettier & ESLint**: Mandatory code formatting and linting tools (`npm run format`, `npm run lint`).
  - **MCP (Model Context Protocol)**: Agent context integration (`mcp_config.json`, `docs/mcp.md`).
- **Trial:**
  - **Playwright (Python/Node)**: Automated visual regression & frontend verification scripts.
- **Assess:**
  - **Automated Dependency Security Patching (Renovate/Dependabot overrides)**: Managed override configurations in `package.json`.
- **Hold:**
  - **Husky Direct Writes to Protected Branches**: CI/CD automation must never attempt direct pushes to protected `main`.

### 4. Patterns & Architecture

- **Adopt:**
  - **Strict Zod Schema Validation**: Validation of content collections (`src/content.config.ts`), feature flags, and environment configs.
  - **Vanilla CSS Glassmorphic Aesthetics**: Zero utility CSS frameworks (no Tailwind); component-scoped vanilla CSS variables.
  - **Workers-First Routing & Assets**: Edge asset handling with Cloudflare Workers fetch handlers.
- **Trial:**
  - **Feature Flag Isolation (`src/content/flags/`)**: Isolated feature toggle flags defined in structured JSON/Zod schemas.
- **Assess:**
  - **View Transitions Navigation**: Native Astro island view transitions.
- **Hold:**
  - **Tailwind CSS / CSS Utility Frameworks**: Prohibited; strictly use native Vanilla CSS.
  - **Any / @ts-ignore Casts**: Prohibited in production application code.

## Rings Definition

- **Adopt:** High confidence, production-proven in this repo. Default choice for new work.
- **Trial:** High potential with low risk. Ready for isolated usage in minor features or scripts.
- **Assess:** Worth tracking and evaluating trade-offs; not yet recommended for active production code.
- **Hold:** Phasing out or proven problematic in our setup. Do not use for new work.
