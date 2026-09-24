# Repository Tech Radar

The Tech Radar documents the active, emerging, and phased-out technologies, frameworks, and architecture patterns across Alexander Härenstam's personal portfolio repository.

## Quadrants & Rings

### 1. Frameworks & Runtimes

- **Adopt:**
  - **Astro (v4+/v7)** - Core static-site framework providing zero-JS HTML by default and island architecture.
  - **Cloudflare Workers Edge Runtime** - Production runtime environment for dynamic routing and edge asset delivery.
  - **TypeScript (Strict Mode)** - Mandatory language standard across all frontend and serverless logic.
- **Trial:**
  - **Node.js Server Runtime (via `@astrojs/node`)** - Isolated test runner server environment (`RENDER=true`) for AI agent verification.
- **Assess:**
  - **Cloudflare Vectorize / Workers AI** - Potential future additions for semantic site search or local AI embedding retrieval.
- **Hold:**
  - **Client-side UI Frameworks (React, Vue, Svelte)** - Keep site lightweight with pure Vanilla CSS/JS and Astro islands.

---

### 2. Infrastructure & Cloud

- **Adopt:**
  - **Cloudflare Workers + Assets (`wrangler.jsonc`)** - Unified Workers-First edge deployment model.
  - **GitHub Actions** - Continuous Integration and release automation (`ci.yml`, `scripts/release.js`).
- **Trial:**
  - **Render Services (`render.yaml`)** - Sandboxed Node environment specifically used for AI agent testing.
- **Assess:**
  - **Cloudflare KV / D1** - Edge key-value and SQL storage for lightweight dynamic state.
- **Hold:**
  - **Legacy Cloudflare Pages (`_routes.json`)** - Deprecated in favor of Workers + Assets binding model.

---

### 3. Tooling & AI Workflows

- **Adopt:**
  - **Vitest** - Primary test runner for unit, schema, and API route tests.
  - **ESLint & Prettier** - Mandatory linter and code formatter.
  - **Zod** - Schema definition and validation engine for content collections and environment variables.
  - **Model Context Protocol (MCP)** - Local AI tool integration via `mcp_config.json`.
  - **Jules Scheduled Agents** - Specialized autonomous AI agents operating within `.Jules/`.
- **Trial:**
  - **Sentry (`@sentry/astro`, `@sentry/cloudflare`)** - Error reporting and performance monitoring integration.
  - **PostHog (`posthog-js`)** - Privacy-friendly edge event analytics.
- **Assess:**
  - **Codecov Vite Plugin** - Test coverage tracking in pull requests.
- **Hold:**
  - **Global AI agent root folders** - Creating journal directories outside `.Jules/` is prohibited.

---

### 4. Patterns & Architecture

- **Adopt:**
  - **Static Pre-Rendering Default (`output: "static"`)** - Generate high-performance HTML at build time.
  - **Vanilla CSS Glassmorphic Styling** - Scoped Vanilla CSS using custom properties and system high-contrast compliance.
  - **Module-Level Constant Hoisting** - Hoisting static RegExp and `Intl.DateTimeFormat` instances to module scope for zero-allocation edge execution.
  - **Content Collection Schemas (`src/content.config.ts`)** - Strict runtime Zod validation for all Markdown and JSON content collections.
- **Trial:**
  - **Static Feature Flags (`src/content/flags/config.json`)** - Decoupled feature toggling for experimental UI enhancements.
- **Assess:**
  - **Cubic Smoothstep Falloff Canvas Animations** - Mathematical canvas light refraction effects without external animation libraries.
- **Hold:**
  - **Tailwind CSS / Heavy External CSS Frameworks** - Prohibited to prevent bundle bloat and design system fragmentation.
  - **Heavy Uncompressed 3D Assets (.obj, .gltf)** - Prohibited to preserve Core Web Vitals (LCP/INP).
