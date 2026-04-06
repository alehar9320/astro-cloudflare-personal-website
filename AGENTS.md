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
- **Rendering:** Defaults to static pre-rendering (`output: "static"` in `astro.config.mjs`).
- **Type Safety:** Strict TypeScript is mandatory. Run `npx wrangler types` after binding changes.
- **Naming Conventions:**
  - PascalCase for Astro components (`MyComponent.astro`).
  - kebab-case for other files (`my-script.ts`).
- **Icons:** Phosphor Icons adapted in `src/components/IconPaths.ts`.

## 3. Development Workflow

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

## 4. AI Constraints (The "Never" List)

- **NEVER** add new top-level dependencies without explicit permission.
- **NEVER** introduce Tailwind CSS or other CSS frameworks unless requested.
- **NEVER** commit secrets or modify `.dev.vars` in the repository.
- **NEVER** modify `wrangler.jsonc` without understanding the Workers-First model.
- **NEVER** commit code that fails `npm run format`, `npm run lint`, or `npm run build`.
- **NEVER** use deprecated Cloudflare Pages models; strictly follow the Workers + Assets binding pattern.

## 5. Deployment & CI/CD

- **CI:** GitHub Actions (`ci.yml`) runs linting, formatting checks, tests, and builds on every PR.
- **CD:** Automated deployment to Cloudflare Workers upon merging to `main`.
- **Release:** Automatic versioning and changelog generation via `scripts/release.js` during deployment.
