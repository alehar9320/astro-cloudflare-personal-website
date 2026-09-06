# Repository Tech Radar

This Tech Radar tracks technologies, tools, runtimes, and architectural patterns evaluated for and used within this personal portfolio repository.

## Quadrants

### 1. Frameworks & Runtimes

- **Adopt**
  - **Astro 7+**: Core framework for SSG and server islands on edge runtime.
  - **TypeScript**: Primary application language with strict type checking.
  - **Node.js (>=22.12.0)**: Local development and CI build runtime target.
- **Trial**
  - **`@astrojs/cloudflare`**: Edge worker adapter for production deployment.
- **Assess**
  - **WebGPU**: For advanced 3D or canvas graphics experiments in laboratory routes.
- **Hold**
  - **`@astrojs/node` in Production**: Used only in Render test environment for debugging. Do not use for production.
  - **React / Vue / Svelte**: No heavy UI framework client hydration bundles.

### 2. Infrastructure & Cloud

- **Adopt**
  - **Cloudflare Workers**: Primary production runtime hosting environment.
- **Trial**
  - **Cloudflare KV / AI Bindings**: Edge storage and AI execution bindings.
- **Assess**
  - **Cloudflare D1**: Edge SQL database for potential state persistence.
- **Hold**
  - **Render Node Server as Production**: Render is exclusively a test harness for AI simulation.

### 3. Tooling & AI Workflows

- **Adopt**
  - **Vitest**: Native ESM test runner for unit and utility testing.
  - **Prettier + prettier-plugin-astro**: Code formatting for Astro and web assets.
  - **ESLint + @typescript-eslint**: Static code analysis and linting.
  - **Husky + lint-staged**: Git pre-commit hook enforcement.
- **Trial**
  - **Sentry (`@sentry/cloudflare`)**: Edge error monitoring and observability.
- **Assess**
  - **Playwright**: End-to-end visual testing and browser verification.
- **Hold**
  - **npm audit automated overrides bypass**: Handled via explicit overrides in `package.json`.

### 4. Patterns & Architecture

- **Adopt**
  - **Zero-Dependency Vanilla CSS**: Custom glassmorphic CSS styling without framework utilities.
  - **Native Pure TS Utilities**: Custom math, physics, and state helpers without external utility libraries.
  - **Zod Content Schema Validation**: Type-safe content collections validation (`src/content.config.ts`).
  - **Feature Flags**: Gated feature rollout pattern via `src/content/flags/config.json`.
- **Trial**
  - **Canvas Device Pixel Ratio Capping**: Capping canvas DPR at `Math.min(window.devicePixelRatio, 2)`.
  - **Pointer-Based Edge Stream Traversal**: Pointer-based SSE string parsing for Cloudflare Workers.
- **Assess**
  - **Client-Side Island Hydration**: Minimizing client JS payloads for static pages.
- **Hold**
  - **Tailwind CSS / Utility-First CSS**: Banned in favor of Vanilla CSS design tokens.
  - **`any` / `@ts-ignore` in TypeScript**: Strictly forbidden by type safety rules.
