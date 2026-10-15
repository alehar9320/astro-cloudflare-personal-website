# Repository Tech Radar

This document provides a ground-truth overview of technology choices, architectural choices, tooling, and infrastructure decisions governing this repository.

## Quadrants

1. **Frameworks & Runtimes**
2. **Infrastructure & Cloud**
3. **Tooling & AI Workflows**
4. **Patterns & Architecture**

---

## Rings

### Adopt

High confidence, production-proven in this repository. Default choice for new work.

- **Frameworks & Runtimes:** Astro, TypeScript, Cloudflare Workers
- **Infrastructure & Cloud:** Cloudflare Workers + Assets (`wrangler.jsonc`), KV Namespaces (`KV_SESSIONS`), Workers AI (`@cf/meta/llama-3.3-70b-instruct`)
- **Tooling & AI Workflows:** Vitest, Prettier, ESLint, Husky, Autonomous AI Agents (`.Jules/`)
- **Patterns & Architecture:** Static Output Pre-rendering, Content Collections with Zod Schema Validation, Single-Pass Regular Expressions, Hardware-Accelerated CSS Animations (`transform`, `opacity`), Scoped Vanilla CSS with Northern Lights Gradient Theme

### Trial

High potential with low risk. Ready for isolated usage in minor features or scripts.

- **Frameworks & Runtimes:** Astro Server Endpoints (`src/pages/api/`)
- **Infrastructure & Cloud:** Render (Jules Node test environment via `RENDER=true` flag)
- **Tooling & AI Workflows:** Playwright (Frontend Verification)
- **Patterns & Architecture:** Static Feature Flags (`src/content/flags/`), Experimental Routes (`src/pages/experimental/`, `src/pages/lab/`)

### Assess

Worth tracking and evaluating trade-offs; not yet recommended for active production code.

- **Frameworks & Runtimes:** WebGL / Canvas 2D interactive utilities (`src/pages/lab/`)
- **Infrastructure & Cloud:** Cloudflare Vectorize / D1 Storage
- **Tooling & AI Workflows:** Automated Visual Regression Testing
- **Patterns & Architecture:** Client-side Web Components

### Hold

Phasing out or proven problematic in our setup. Do not use for new work.

- **Frameworks & Runtimes:** Tailwind CSS, Heavy CSS Frameworks (Bootstrap, Bulma)
- **Frameworks & Runtimes:** Heavy Client JS Frameworks (React, Vue, Svelte on static routes without hydration necessity)
- **Infrastructure & Cloud:** Dedicated Node.js Always-On VPS Hosting for Production
- **Tooling & AI Workflows:** Dynamic/Third-party Feature Flag SDKs (LaunchDarkly, Split)
- **Patterns & Architecture:** Dynamic Server-Side Rendering (SSR) for main content pages (prefer static pre-rendering)
