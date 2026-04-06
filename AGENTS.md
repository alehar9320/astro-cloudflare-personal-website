# AGENTS.md - AI Agent Source of Truth

## 1. Project Overview

- **Mission:** A personal portfolio website for Alexander Härenstam, showcasing professional journey, skills, projects, and publications. Built with a focus on speed, SEO, and modern web standards.
- **Stack:**
  - **Framework:** Astro (v4+)
  - **Runtime & Deployment:** Cloudflare Workers + Assets (Unified Workers-First architecture)
  - **Language:** TypeScript (Strict mode)
  - **Styling:** Vanilla CSS
  - **Testing:** Vitest
  - **Linting & Formatting:** ESLint, Prettier

## 2. Architecture & Patterns

### Directory Map

- `src/components/`: Reusable Astro components.
- `src/content/`: Content collections for projects and work experience.
- `src/layouts/`: Base page layouts.
- `src/pages/`: Route-level components.
- `src/styles/`: Global and shared CSS styles.
- `src/data/`: Static data used across the site.
- `context/`: Background information about the author.
- `scripts/`: Build and release automation scripts.

### Patterns

- **Workers-First Model:** Uses the modern Cloudflare Workers + Assets binding (`wrangler.jsonc`).
- **Rendering:** Defaults to static rendering (`output: "static"` in `astro.config.mjs`) for edge flexibility (In Astro 6+, this behaves as the previous hybrid mode).
- **Type Safety:** Strict TypeScript is mandatory. Run `npx wrangler types` after binding changes.
- **Naming Conventions:**
  - PascalCase for Astro components (`MyComponent.astro`).
  - kebab-case for other files (`my-script.ts`).
- **Icons:** Phosphor Icons adapted in `src/components/IconPaths.ts`.

## 3. Cloudflare Astro Workers-First Standard

This project follows the modern "Workers with Assets" model. Legacy "Pages" build configurations are strictly deprecated.

### 1. Infrastructure & Asset Mapping

- **Unified Logic:** Enforce the "Workers with Assets" model.
- **Config Enforcement:**
  - `wrangler.jsonc` must contain: `"assets": { "directory": "./dist/client", "binding": "ASSETS" }`.
  - `wrangler.jsonc` must contain: `"main": "./dist/server/entry.mjs"`.
- **Compatibility:** Always set `compatibility_date` to `2025-05-21` (or the current date) to enable modern workerd features.

### 2. Adapter & Build Parity

- **Adapter:** Exclusively use `@astrojs/cloudflare`.
- **Environment Parity:** Force `prerenderEnvironment: 'workerd'` in `astro.config.mjs`. This ensures that logic during the build process (like `Astro.locals`) behaves exactly as it will on the Cloudflare edge.
- **Vite Integration:** Enable the Vite Environment API within the Astro config for enhanced local emulation of the Cloudflare runtime.

### 3. Rendering Strategy

- **Static Default:** Set `output: 'static'` as the architectural standard (In Astro 6+, this behaves as the previous hybrid mode).
- **Resource Optimization:** Pre-render all static content. Reserve `export const prerender = false` strictly for routes requiring dynamic headers, authentication, or live database hits.
- **Edge Assets:** Utilize `imageService: 'cloudflare-binding'` to ensure image optimization occurs at the edge, reducing bundle size and execution time.

### 4. Data & State Management

- **Native Bindings:** Prioritize Cloudflare-native storage (D1 for SQL, R2 for Objects, KV for Cache) over external SaaS databases to eliminate cold-start latency and egress costs.
- **Environment Access:** Access all secrets and bindings through `import { env } from 'cloudflare:workers'` (Astro 6+) or `Astro.locals.runtime.env` (Legacy).
- **Type Safety:** Mandate a `npx wrangler types` workflow. All bindings must be explicitly typed.

### 5. Security & Deployment Guardrails

- **Zero-Secret Policy:** Strictly forbid hardcoding credentials. Enforce `.dev.vars` for local development and `wrangler secret` for production.
- **Routing Reliability:** Explicitly define 404 behavior and trailing slash preferences in `astro.config.mjs`, as the Workers-first model does not inherit the implicit routing rules of legacy Pages.
- **Cold Start Optimization:** Keep the server entry point lean. Avoid large npm dependencies that increase the Worker bundle size and execution time.

## 4. Development Workflow

### Setup

```bash
npm install
cp .dev.vars.example .dev.vars # Configure local environment variables
```

### Quality Control

- **Development:** `npm run dev`
- **Build:** `npm run build`
- **Test:** `npm run test` or `npm run test:coverage`
- **Lint:** `npm run lint`
- **Format:** `npm run format` (MANDATORY before commit)
- **Type Check:** `npm run astro check`

### Release and Deployment

- **Cloudflare Auto-Deploy:** Production deploys are triggered by Cloudflare's Git integration when `main` receives a new commit.
- **Release Source of Truth:** GitHub releases and tags are the canonical source for versioning and changelog history.
- **GitHub Actions Role:** CI validates changes on PRs and, on `main`, creates a GitHub release from `scripts/release.js`. It must not push generated release files back to protected `main`.
- **Footer + What's New:** The footer version link and `/whats-new` page consume GitHub release data rather than tracked repo artifacts.

## 5. AI Constraints (The "Never" List)

- **NEVER** add new top-level dependencies without explicit permission.
- **NEVER** introduce Tailwind CSS or other CSS frameworks unless requested.
- **NEVER** commit secrets or modify `.dev.vars` in the repository.
- **NEVER** modify `wrangler.jsonc` without understanding the Workers-First model.
- **NEVER** commit code that fails `npm run format`, `npm run lint`, or `npm run build`.
- **NEVER** use deprecated Cloudflare Pages models; strictly follow the Workers + Assets binding pattern.
- **NEVER** add or preserve a parallel manual production deploy step in CI when Cloudflare Git auto-deploy already owns production releases.
- **NEVER** design automation that depends on direct writes back to protected `main` for release metadata.

## 6. AI Agent Skills

Project-specific AI agent skills are defined in the `.agents/skills/` directory. These skills provide focused instructions for:

- Edge-First Engineering (Cloudflare Workers + Assets)
- Strict Type-Safety & Schema Integrity
- Astro Content Architecture
- Vanilla Performance Optimization
- Automated Quality Assurance
- Persona & Context Alignment

Refer to the individual `SKILL.md` files in each skill folder for detailed guidance.

## 7. Deployment & CI/CD

- **CI:** GitHub Actions (`ci.yml`) runs linting, formatting checks, tests, and builds on every PR.
- **CD:** Cloudflare automatically deploys pushes to `main` through its Git integration.
- **Release:** GitHub Actions runs `scripts/release.js` on `main` and creates the GitHub release for that version without mutating `main`.
