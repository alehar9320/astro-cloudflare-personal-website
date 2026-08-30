# Repository Tech Radar

This document provides explicit ground-truth context regarding technology choices, structural patterns, and architectural boundaries across the repository for human developers and autonomous AI agents.

## Structure

### Quadrants

1. **Frameworks & Runtimes:** Core web application frameworks, rendering engines, and execution runtimes.
2. **Infrastructure & Cloud:** Hosting platforms, edge computing bindings, key-value stores, and observability tooling.
3. **Tooling & AI Workflows:** Build scripts, testing frameworks, linters, formatters, and AI agent integration tools.
4. **Patterns & Architecture:** Architectural models, state management strategies, design systems, and data validation paradigms.

### Rings

- **Adopt:** High confidence, production-proven in this repository. Default choice for new work.
- **Trial:** High potential with low risk. Scoped for isolated usage in minor features, experimental routes, or scripts.
- **Assess:** Worth tracking and evaluating trade-offs; not recommended for active production code without prior RFC.
- **Hold:** Phasing out or proven problematic in our architecture. Banned for new development.

---

## 1. Frameworks & Runtimes

| Technology / Spec                | Ring  | Decision Summary / Context                                                         |
| :------------------------------- | :---- | :--------------------------------------------------------------------------------- |
| **Astro (v4+)**                  | Adopt | Primary static-first framework; optimized for speed and SEO.                       |
| **TypeScript (Strict Mode)**     | Adopt | Repository-wide mandatory type system enforcing explicit interfaces.               |
| **Cloudflare Workers (Runtime)** | Adopt | Primary production execution runtime for serverless APIs and static asset serving. |
| **Node.js (>=22.12.0)**          | Adopt | Tooling and test execution environment; sandbox test runtime for Render/Jules.     |
| **React / Vue / Svelte**         | Hold  | Avoid heavy client-side UI frameworks to maintain minimal JS payload sizes.        |

## 2. Infrastructure & Cloud

| Technology / Spec                | Ring  | Decision Summary / Context                                                   |
| :------------------------------- | :---- | :--------------------------------------------------------------------------- |
| **Cloudflare Workers + Assets**  | Adopt | Unified Workers-First deployment architecture (`wrangler.jsonc`).            |
| **Cloudflare KV (`CHAT_STORE`)** | Adopt | Serverless key-value storage for chat session history and persistence.       |
| **Cloudflare Workers AI (`AI`)** | Adopt | Edge AI binding for client-side chat completions and agent interactions.     |
| **Sentry (`@sentry/astro`)**     | Adopt | Production monitoring and error tracking telemetry integration.              |
| **PostHog (`posthog-js`)**       | Adopt | Web analytics tracking injected via Workers environment variables.           |
| **Deprecated Cloudflare Pages**  | Hold  | Legacy deployment model; strictly superseded by Cloudflare Workers + Assets. |

## 3. Tooling & AI Workflows

| Technology / Spec                | Ring  | Decision Summary / Context                                                       |
| :------------------------------- | :---- | :------------------------------------------------------------------------------- |
| **Vitest**                       | Adopt | Fast unit and integration test runner for utilities and content schemas.         |
| **Prettier & ESLint**            | Adopt | Repository code style and linting enforcement suite.                             |
| **Husky & lint-staged**          | Adopt | Git pre-commit hooks for automated linting and formatting verification.          |
| **Google Jules Agents**          | Adopt | Autonomous AI software engineer agents operating via `.Jules/` journals.         |
| **Model Context Protocol (MCP)** | Adopt | Standardized integration tools defined in `mcp_config.json`.                     |
| **Framer Motion / GSAP**         | Hold  | Banned for animations; use hardware-accelerated Vanilla CSS transitions instead. |

## 4. Patterns & Architecture

| Technology / Spec                       | Ring  | Decision Summary / Context                                                                                                       |
| :-------------------------------------- | :---- | :------------------------------------------------------------------------------------------------------------------------------- |
| **Schema-First Validation (Zod)**       | Adopt | Mandatory Zod validation at content, API, and environment boundaries ([ADR 0002](adr/0002-schema-first-validation-with-zod.md)). |
| **Workers-First Architecture**          | Adopt | Edge execution with static pre-rendering ([ADR 0001](adr/0001-cloudflare-production-render-jules.md)).                           |
| **Vanilla CSS Glassmorphic Aesthetics** | Adopt | Northern Lights glassmorphism UI pattern without external CSS frameworks.                                                        |
| **Experimental Lab Isolation**          | Adopt | Isolate 3D canvas micro-features in `src/pages/lab/` or `src/pages/experimental/`.                                               |
| **Tailwind CSS / Utility Frameworks**   | Hold  | Strictly forbidden in repository to prevent CSS abstraction clutter.                                                             |
| **Direct Protect-Branch Mutations**     | Hold  | Automation must not push generated releases back to protected `main`.                                                            |
