# Repository Tech Radar

This Tech Radar tracks technologies, tools, infrastructure, and patterns evaluated or adopted in Alexander Härenstam's personal portfolio repository.

## Quadrants

1. **Frameworks & Runtimes**
2. **Infrastructure & Cloud**
3. **Tooling & AI Workflows**
4. **Patterns & Architecture**

---

## 1. Frameworks & Runtimes

- **Adopt**
  - **Astro (v4+):** Primary web framework for static site generation and component islands.
  - **TypeScript:** Mandatory strict typing language across the repository.
  - **Vanilla CSS:** Primary styling choice; zero framework overhead, hardware-accelerated animations.
- **Trial**
  - **Node.js (@astrojs/node):** Isolated standalone server adapter used exclusively in Jules Render test environment (`RENDER=true`).
- **Assess**
  - _(None currently under active assessment)_
- **Hold**
  - **Tailwind CSS / CSS Frameworks:** Banned to preserve pure Vanilla CSS aesthetic, low build size, and custom design tokens.

---

## 2. Infrastructure & Cloud

- **Adopt**
  - **Cloudflare Workers + Assets:** Workers-First production hosting model (`wrangler.jsonc`).
  - **GitHub Actions:** CI pipeline runner for testing, linting, formatting, and automated release script execution.
- **Trial**
  - **Render Environment:** Isolated secondary test runtime for AI agent debugging.
- **Assess**
  - **Cloudflare KV / D1:** Edge storage capabilities for future dynamic enhancements.
- **Hold**
  - **Cloudflare Pages (Legacy):** Deprecated in favor of the modern Workers-First model.

---

## 3. Tooling & AI Workflows

- **Adopt**
  - **Vitest:** Native TypeScript test runner for unit tests and schema assertions.
  - **ESLint & Prettier:** Automated code style and quality enforcement.
  - **Astro Check (`astro check`):** Type checking and template diagnostic validator.
  - **MCP Servers (Model Context Protocol):** Standardized context protocol for agent integration (`mcp_config.json`).
- **Trial**
  - **Jules AI Agents Framework:** Autonomous role-based engineering agents operating in the repository.
- **Assess**
  - **Codecov Bundle Analysis:** Vite plugin tracking production bundle size drift.
- **Hold**
  - **Direct Push to Protected Main:** Pushing unvalidated commits directly to `main` without PR or CI checks.

---

## 4. Patterns & Architecture

- **Adopt**
  - **Static Island Hydration & Prerendering:** Default static HTML generation with targeted interactive component islands.
  - **Zod Schema Validation:** Mandatory compile-time and runtime validation for content collections and config objects.
  - **Architecture Decision Records (ADRs):** Governance pattern for documenting architectural decisions and AI directives (`docs/adr/`).
  - **Glassmorphic / Northern Lights Aesthetic:** Core visual styling language with responsive fallback support.
- **Trial**
  - **Module-Level RegExp Hoisting & O(1) Lookups:** Edge utility performance optimization patterns.
- **Assess**
  - _(None currently under assessment)_
- **Hold**
  - **Client-Side Heavy Animation Libraries:** GSAP, Three.js, Framer Motion - forbidden in core pages to maintain 60fps vanilla performance.
