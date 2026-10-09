# Repository Tech Radar

## Quadrants

1. **Frameworks & Runtimes**
2. **Infrastructure & Cloud**
3. **Tooling & AI Workflows**
4. **Patterns & Architecture**

---

## Rings Summary

- **Adopt:** High confidence, production-proven in this repository. Standard choice for new work.
- **Trial:** High potential with low risk. Proven in isolated experiments or scripts.
- **Assess:** Under evaluation; worth monitoring trade-offs before active production adoption.
- **Hold:** Phased out or incompatible with repo constraints. Do not use for new work.

---

## 1. Frameworks & Runtimes

- **Adopt:**
  - **Astro v5:** Primary static site generator and component runtime.
  - **TypeScript (Strict Mode):** Type-safety across components, API routes, and tests.
  - **Vanilla CSS (Scoped):** Zero-runtime CSS styling with Northern Lights theme variables.
- **Trial:**
  - **HTML5 Canvas Micro-Animations:** Lightweight canvas physics and interactive background loops (`src/pages/lab/`).
- **Assess:**
  - **WebGPU / WebGL:** Native high-performance graphics experiments in isolated laboratory routes (`src/pages/lab/`).
- **Hold:**
  - **Tailwind CSS:** Anti-goal. Banned to avoid utility bloat and maintain vanilla CSS simplicity.
  - **Heavy Client JS Frameworks (React, Vue, Svelte):** Banned for core content pages to preserve sub-millisecond static page performance.
  - **Heavy JS Animation Frameworks (Framer Motion, GSAP):** Banned to maintain lean bundle footprints and hardware-accelerated CSS transitions.

## 2. Infrastructure & Cloud

- **Adopt:**
  - **Cloudflare Workers & Assets:** Primary edge deployment target (`wrangler.jsonc`, `src/cloudflare-worker.ts`).
  - **Cloudflare KV (`CHAT_STORE`):** Key-value edge storage for persistence.
  - **Workers AI (`AI`):** Native edge AI integration.
- **Trial:**
  - **Render Node Standalone Server:** Jules AI debugging test environment (`render.yaml`).
- **Assess:**
  - **Cloudflare D1 / Vectorize:** Under evaluation for future structured edge data or vector retrieval experiments.
- **Hold:**
  - **Node.js Production Server:** Production is strictly Cloudflare Workers; Node is restricted to build/test tooling and Render debug fallback.

## 3. Tooling & AI Workflows

- **Adopt:**
  - **Vitest:** Primary unit testing runner for utilities, schemas, and components.
  - **Prettier & ESLint:** Code style and syntax linting enforcement.
  - **Autonomous AI Agents (Jules, Archie, Bolt, Kinetic, Vantage, Palette, Oracle, Sentinel, Engine, StuntDouble, Docu):** Role-bounded autonomous workflow execution.
- **Trial:**
  - **Playwright:** E2E and visual testing suite.
- **Assess:**
  - **Codecov Bundle Analysis:** Automated PR bundle size impact analysis.
- **Hold:**
  - **Global AI Mutation without Role Scopes:** Unbounded AI agents operating without clear ADR boundaries.

## 4. Patterns & Architecture

- **Adopt:**
  - **Static Pre-Rendering (`output: 'static'`):** Build-time static HTML generation for high Core Web Vitals.
  - **Zod Frontmatter & Input Schema Validation:** Strict runtime and build-time validation for content collections (`src/content.config.ts`).
  - **Safe JSON-LD Script Serialization:** XSS-safe structured data embedding (`JSON.stringify(schema).replace(/</g, '\\u003c')`).
  - **WCAG 2.1 AA Motion & Touch Target Standards:** `prefers-reduced-motion` media queries and 44x44px touch targets.
- **Trial:**
  - **Dynamic Spatial Step Sampling:** Frame-rate optimized canvas step calculations based on viewport width (`Math.max(4, Math.floor(w / 120))`).
  - **Feature-Flagged Active Press Feedback:** Hardware-accelerated touch feedback gated behind `src/content/flags/config.json`.
- **Assess:**
  - **Edge Caching Header Customization:** Dynamic TTL caching rules for edge worker responses.
- **Hold:**
  - **Full Dynamic SSR on Content Routes:** Disallowed to maintain static performance targets.
  - **Raw `set:html` Unsanitized Injection:** Forbidden vector for XSS vulnerabilities.
