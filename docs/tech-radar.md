# Repository Tech Radar

This Tech Radar tracks technologies, runtimes, tooling, and architectural patterns evaluated, adopted, or phased out within Alexander Härenstam's personal portfolio repository.

---

## Quadrants & Rings Overview

### Rings

- **Adopt:** High confidence, production-proven in this repo. Default choice for new work.
- **Trial:** High potential with low risk. Ready for isolated usage in minor features or experimental routes.
- **Assess:** Worth tracking and evaluating trade-offs; not yet recommended for active production code.
- **Hold:** Phasing out, banned, or proven problematic in our setup. Do not use for new work.

---

## 1. Frameworks & Runtimes

- **Adopt**
  - **Astro (v4+):** Primary web framework. Static pre-rendering (`output: "static"`) guarantees fast page loads, SEO excellence, and zero JS overhead by default.
  - **Cloudflare Workers Edge Runtime:** Production runtime environment for edge execution, custom worker routing, and serverless AI/KV APIs.
  - **TypeScript (Strict Mode):** Mandatory type safety across components, utilities, and Workers entrypoints. No `any` or `@ts-ignore`.
- **Trial**
  - **Node.js Standalone Mode:** Headless test runtime environment (`@astrojs/node` on Render) for automated AI agent testing.
- **Assess**
  - **Cloudflare Workers AI:** On-demand edge inference using bound Workers AI models.
- **Hold**
  - **Legacy Cloudflare Pages:** Deprecated runtime model. Strictly replaced by Workers + Assets (`wrangler.jsonc`).

---

## 2. Infrastructure & Cloud

- **Adopt**
  - **Cloudflare Assets (`ASSETS` Binding):** Edge CDN static asset delivery configured directly in `wrangler.jsonc`.
  - **Cloudflare KV (`CHAT_STORE`):** Key-value storage binding for persistence at the edge.
  - **Sentry (@sentry/astro):** Runtime error monitoring and telemetry integration.
- **Trial**
  - **PostHog Analytics:** Privacy-focused analytics integrated via `PUBLIC_POSTHOG_*` variables in `wrangler.jsonc`.
- **Assess**
  - **Cloudflare Vectorize / D1:** Potential future edge database options if structured search or embeddings are required.
- **Hold**
  - **Third-Party External CMS Services:** Avoid external headless CMS dependencies; content collections with Zod schemas in `src/content/` serve as the source of truth.

---

## 3. Tooling & AI Workflows

- **Adopt**
  - **Vitest:** Unit testing framework for utility functions, route endpoints, and Zod schemas.
  - **Prettier & ESLint (Flat Config):** Enforced formatting and linting rules across all commits.
  - **Model Context Protocol (MCP):** Configured via `mcp_config.json` for Astro documentation, Render API, and local workspace context.
  - **Autonomous AI Agents (Jules Suite):** Domain-driven autonomous agent personas (Archie, Stratus, Kinetic, Palette, Vantage, Apex, etc.).
- **Trial**
  - **Custom Jules Python Tools:** Internal helper scripts in `/home/jules/self_created_tools` for AST verification, ADR integrity checks, and link validation.
- **Assess**
  - **Playwright Visual Verification:** Headless browser automation scripts for visual regression checks.
- **Hold**
  - **Manual Deployment Scripts:** Direct manual production deployment commands. All production releases are owned by Cloudflare Git integration on `main`.

---

## 4. Patterns & Architecture

- **Adopt**
  - **Workers-First Static Pre-Rendering:** Static-first Astro build output combined with Cloudflare Worker routing (`[ADR 0002](./adr/0002-unified-workers-first-assets-architecture.md)`).
  - **Schema-First Type Safety with Zod:** Comprehensive Zod schemas for content collections, API payloads, and environment variables.
  - **Scoped Vanilla CSS & Glassmorphism:** Lightweight CSS custom properties, system-color high contrast support (`forced-colors`), and hardware-accelerated animations (`transform`, `opacity`).
  - **Zero-Allocation Utility Functions:** Edge-optimized utility functions avoiding unnecessary object/array allocations in high-frequency request paths.
- **Trial**
  - **Experimental Routes Pattern:** Isolate new features under `src/pages/experimental/` behind feature flags in `src/content/flags/config.json`.
- **Assess**
  - **Cubic Smoothstep Canvas Refraction:** Pointer-driven canvas animations with strict lifecycle teardown on `astro:before-swap`.
- **Hold**
  - **Tailwind CSS & Heavy CSS Frameworks:** Banned from repository. Strictly use Vanilla CSS with CSS custom properties.
  - **Heavy Client-Side Hydration Frameworks (React, Vue, Svelte):** Banned for core content pages. Prefer Astro static HTML or Vanilla JS micro-interactions.
