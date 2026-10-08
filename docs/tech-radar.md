# Repository Tech Radar

This Tech Radar tracks technologies, patterns, and infrastructure options across four quadrants and four adoption rings.

## Quadrants

1. **Frameworks & Runtimes**
2. **Infrastructure & Cloud**
3. **Tooling & AI Workflows**
4. **Patterns & Architecture**

## Rings

- **Adopt:** High confidence, production-proven in this repo. Default choice for new work.
- **Trial:** High potential with low risk. Ready for isolated usage in minor features or scripts.
- **Assess:** Worth tracking and evaluating trade-offs; not yet recommended for active production code.
- **Hold:** Phasing out or proven problematic in our setup. Do not use for new work.

---

## 1. Frameworks & Runtimes

| Technology                                      | Ring  | Notes                                                                                       |
| ----------------------------------------------- | ----- | ------------------------------------------------------------------------------------------- |
| **Astro (v4+)**                                 | Adopt | Core web framework for personal portfolio, static page generation, and component rendering. |
| **TypeScript (Strict Mode)**                    | Adopt | Mandatory language choice across all frontend components, scripts, and serverless handlers. |
| **Node.js Server Adapter (`@astrojs/node`)**    | Trial | Dedicated to Google Jules test environment on Render (`render.yaml`). Not for production.   |
| **Client-side Frameworks (React, Vue, Svelte)** | Hold  | Prefer Astro components and lightweight Vanilla JS to avoid runtime bundle overhead.        |

## 2. Infrastructure & Cloud

| Technology                      | Ring  | Notes                                                                                  |
| ------------------------------- | ----- | -------------------------------------------------------------------------------------- |
| **Cloudflare Workers + Assets** | Adopt | Modern unified edge hosting and serverless worker routing (`wrangler.jsonc`).          |
| **Sentry (`@sentry/astro`)**    | Adopt | Error monitoring and performance tracing for Cloudflare Worker & browser environments. |
| **Render (`render.yaml`)**      | Trial | Auxiliary testbed environment specifically for AI agent (Google Jules) debugging runs. |
| **Cloudflare Pages (Legacy)**   | Hold  | Legacy deployment model. All routing migrated to Workers + Assets.                     |

## 3. Tooling & AI Workflows

| Technology                                           | Ring  | Notes                                                                                            |
| ---------------------------------------------------- | ----- | ------------------------------------------------------------------------------------------------ |
| **Vitest**                                           | Adopt | Primary unit and component integration test runner (`npm run test`).                             |
| **ESLint & Prettier**                                | Adopt | Code style, linting, and formatting pipeline (`npm run lint`, `npm run format`).                 |
| **Model Context Protocol (MCP)**                     | Adopt | Standardized agent interfaces defined in `mcp_config.json` (`astro-docs`, `render`, `context7`). |
| **3rd-Party UI CSS Libraries (Tailwind, Bootstrap)** | Hold  | Banned across repo. Maintain lightweight Vanilla CSS with design tokens.                         |

## 4. Patterns & Architecture

| Technology                                         | Ring  | Notes                                                                                             |
| -------------------------------------------------- | ----- | ------------------------------------------------------------------------------------------------- |
| **Static Site Pre-Rendering (`output: 'static'`)** | Adopt | Default compilation mode for Astro pages providing optimal edge speed and zero compute cost.      |
| **Zod Schema Validation**                          | Adopt | Strict compile-time and runtime validation for content frontmatter, API routes, and config files. |
| **Feature Flags (`src/content/flags/`)**           | Adopt | Static content-backed feature toggles for experimental features and interactive components.       |
| **Global State Management (Redux, Zustand)**       | Hold  | Unnecessary complexity for static portfolio; use URL state or scoped component state.             |
