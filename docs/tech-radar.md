# Repository Tech Radar

This document maintains the technology landscape for Alexander Härenstam's personal portfolio repository across four standard rings and four operational quadrants. It serves as ground truth context for human engineers and autonomous AI agents.

## Rings

- **Adopt:** High confidence, production-proven in this repository. Default choice for new work.
- **Trial:** High potential with low risk. Ready for isolated usage in targeted features, scripts, or experimental routes.
- **Assess:** Worth tracking and evaluating trade-offs; not yet recommended for active production code.
- **Hold:** Phasing out or proven problematic in our setup. Do not use for new work.

## Quadrants

### 1. Frameworks & Runtimes

- **Adopt:**
  - **Astro (v7+):** Primary web framework using Static Site Generation (`output: "static"`).
  - **Cloudflare Workers:** Unified edge runtime with `@astrojs/cloudflare` adapter.
  - **TypeScript:** Strict type checking across all client and server code.
- **Trial:**
  - **Edge SSR Endpoints:** Selected dynamic routes (e.g. RSS/Sitemap GET routes).
- **Assess:**
  - **Cloudflare Workers AI:** On-demand edge inference for interactive portfolio features.
- **Hold:**
  - **Node.js Standalone Production Server:** Phased out for production (Render Node adapter path retained strictly for Jules AI testing per [ADR 0001](adr/0001-cloudflare-production-render-jules.md)).

### 2. Infrastructure & Cloud

- **Adopt:**
  - **Cloudflare Workers + Assets:** Unified static asset hosting and edge worker binding (`wrangler.jsonc`).
  - **Cloudflare Pages Static Headers:** Non-breaking static cache headers via `public/_headers`.
- **Trial:**
  - **Sentry Cloudflare SDK:** Production error reporting (`@sentry/cloudflare`).
- **Assess:**
  - **Cloudflare KV / D1:** Distributed storage for interactive feedback or analytics.
- **Hold:**
  - **Legacy Cloudflare Pages Builds:** Phased out in favor of Workers + Assets binding model.

### 3. Tooling & AI Workflows

- **Adopt:**
  - **Vitest:** Primary fast unit and integration test runner.
  - **Zod:** Compile-time and runtime schema validation for content collections and flags.
  - **ESLint & Prettier:** Code quality, formatting, and linting standards.
  - **Jules & Specialized AI Agents:** Autonomous workflow agents operating with explicit directives.
  - **Phosphor Icons (`IconPaths.ts`):** Inline SVG icon system.
- **Trial:**
  - **MCP Servers (`mcp_config.json`):** Model Context Protocol integrations (`astro-docs`, `context7`, `render`).
- **Assess:**
  - **Playwright Visual Testing:** End-to-end automated visual verification scripts.
- **Hold:**
  - **Tailwind CSS / External CSS Frameworks:** Explicitly banned in favor of scoped Vanilla CSS.

### 4. Patterns & Architecture

- **Adopt:**
  - **Static Island Hydration:** Zero-JS static HTML by default; client scripts gated by intent.
  - **Static Feature Flags:** Gated micro-interactions via `src/content/flags/config.json` and Zod schema ([ADR 0002](adr/0002-static-feature-flags-via-content-collections.md)).
  - **Vanilla CSS Glassmorphism:** CSS variable-based styling, glassmorphism, and responsive media queries.
  - **Intl.DateTimeFormat Edge Hoisting:** Module-level Intl instance reuse for Cloudflare Workers edge runtimes.
  - **WCAG 2.1 AA Touch Ergonomics:** 44x44px touch targets on navigation and interactive components.
- **Trial:**
  - **Canvas Light Refraction (Prism):** Lightweight 60fps HTML5 canvas micro-interactions with smoothstep falloff.
  - **Tactile Feedback Transforms:** Hardware-accelerated `:active` transforms gated behind flags and `prefers-reduced-motion`.
- **Assess:**
  - **Edge Micro-Caching Strategies:** Per-route dynamic revalidation headers.
- **Hold:**
  - **Heavy WebGL / 3D Asset Imports:** Large `.obj`/`.gltf` assets banned to maintain sub-100ms LCP.
