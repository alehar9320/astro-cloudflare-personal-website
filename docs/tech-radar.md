# Repository Tech Radar

This document maintains the technical evaluation and technology classification for Alexander Härenstam's portfolio. It guides developers and autonomous AI agents on technology choices, phasing out decaying patterns, and adopting new capabilities.

## Quadrants & Technology Status

### 1. Frameworks & Runtimes

- **Adopt:**
  - **Astro (v4/v5):** Core static-site generator and component framework (`output: "static"`). High performance, zero JS by default.
  - **TypeScript (v5+):** Mandatory strict-mode static typing across all source files, APIs, and scripts.
  - **Cloudflare Workers Edge Runtime:** Production target runtime for static asset serving and edge APIs.
- **Trial:**
  - **Node.js (v22+ LTS Standalone):** Used strictly for local development tooling and Render test environment execution.
- **Assess:**
  - **Wasm (WebAssembly):** Potential for edge-side high-performance computing tasks if complex client/edge logic is required in the future.
- **Hold:**
  - **Client-Side SPA Frameworks (React / Vue / Svelte):** Avoid introducing dynamic client framework overhead for static portfolio pages; rely on native Astro components and Vanilla JS.

### 2. Infrastructure & Cloud

- **Adopt:**
  - **Cloudflare Workers + Assets (`wrangler.jsonc`):** Unified static asset hosting with direct Workers bindings access.
  - **Cloudflare KV (`CHAT_STORE`):** Key-Value storage for edge persistent state (e.g., chat/AI session caching).
  - **Sentry (@sentry/cloudflare & @sentry/astro):** Edge and client exception tracking.
- **Trial:**
  - **Cloudflare Workers AI (`AI` binding):** Edge machine learning model invocation for experimental interaction tools.
- **Assess:**
  - **Cloudflare D1 / Vectorize:** Structured SQL/vector storage at the edge for future interactive data indexing.
- **Hold:**
  - **Cloudflare Pages (`functions/` & `_routes.json`):** Superseded by unified Workers + Assets model (see [ADR 0002](./adr/0002-workers-first-assets-binding-architecture.md)).
  - **Render as Production:** Render is strictly restricted to Jules test environment (see [ADR 0001](./adr/0001-cloudflare-production-render-jules.md)).

### 3. Tooling & AI Workflows

- **Adopt:**
  - **Vitest:** Fast unit testing framework for helper utilities, parsers, and edge functions.
  - **Prettier & ESLint (v10+):** Enforced code formatting and linting pipeline.
  - **Jules & Specialized AI Agents (Sentinel, Palette, Archie, etc.):** Autonomous agent workflows governed by `AGENTS.md` directives and journals in `.Jules/`.
  - **PostHog (`posthog-js`):** Privacy-conscious telemetry and analytics.
- **Trial:**
  - **Model Context Protocol (MCP):** Structured AI tool integration via `mcp_config.json`.
- **Assess:**
  - **Playwright E2E Testing:** End-to-end visual regression testing for Astro component rendering.
- **Hold:**
  - **Direct Push to Protected `main`:** All agent and developer changes must go through PR pipeline and CI validation.

### 4. Patterns & Architecture

- **Adopt:**
  - **Zod Schema Validation:** Mandatory validation boundary for content collections, API requests, and environment variables (see [`docs/zod-guidelines.md`](./zod-guidelines.md)).
  - **Vanilla CSS Glassmorphism:** Custom scoped CSS with hardware-accelerated transitions and WCAG 2.1 AA accessibility compliance.
  - **Static Pre-Rendering with Edge API Fallbacks:** Pre-rendered HTML routes with edge Worker fallback handlers for dynamic features.
  - **Focus-Visible Accessibility Standard:** Using `:focus-visible` over raw `:focus` and enforcing 44x44px mobile touch targets.
- **Trial:**
  - **Feature Flags (`src/content/flags/`):** Lightweight JSON-backed toggles for isolating experimental features.
- **Assess:**
  - **Partial Hydration (Astro Islands):** Using `client:visible` or `client:media` only when interactive dynamic client elements are required.
- **Hold:**
  - **Tailwind CSS / Utility Class Frameworks:** Banned in favor of maintainable Vanilla CSS and scoped Astro styles.
  - **Global CSS Frameworks / Component Libraries:** Prohibited to maintain ultra-lean bundle footprint and bespoke design.
