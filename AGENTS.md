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

### Release and Deployment

- **Cloudflare Auto-Deploy:** Production deploys are triggered by Cloudflare's Git integration when `main` receives a new commit.
- **Release Artifacts:** `scripts/release.js` is the source of truth for `src/data/version.json` and `CHANGELOG.md`. These files are tracked and must remain commitable.
- **GitHub Actions Role:** CI validates changes on PRs and, on `main`, generates and commits release artifacts plus creates the GitHub release. It must not bypass Cloudflare by introducing a second manual production deploy path.
- **Footer + What's New:** The footer version link and `/whats-new` page both depend on the tracked release artifacts being up to date.

## 4. AI Constraints (The "Never" List)

- **NEVER** add new top-level dependencies without explicit permission.
- **NEVER** introduce Tailwind CSS or other CSS frameworks unless requested.
- **NEVER** commit secrets or modify `.dev.vars` in the repository.
- **NEVER** modify `wrangler.jsonc` without understanding the Workers-First model.
- **NEVER** commit code that fails `npm run format`, `npm run lint`, or `npm run build`.
- **NEVER** use deprecated Cloudflare Pages models; strictly follow the Workers + Assets binding pattern.
- **NEVER** add or preserve a parallel manual production deploy step in CI when Cloudflare Git auto-deploy already owns production releases.

## 5. AI Agent Skills

To maintain the high standards of this project, AI agents should possess and apply the following skills:

### Edge-First Engineering

- **Concept:** Mastery of the Cloudflare Workers + Assets architecture.
- **Action:** Prioritize Cloudflare-native bindings (D1, R2, KV) over external SaaS to minimize latency and egress. Ensure all server-side logic is compatible with the `workerd` runtime.

### Strict Type-Safety & Schema Integrity

- **Concept:** Zero-tolerance for `any` or loose typing.
- **Action:** Enforce strict TypeScript across the entire codebase. When modifying bindings, immediately run `npx wrangler types` to update environment definitions. Ensure content collections strictly adhere to defined Zod schemas.

### Astro Content Architecture

- **Concept:** Expert-level knowledge of Astro's content layer and component model.
- **Action:** Leverage content collections for all data-driven elements. Maintain clean separation between logic (Astro scripts) and presentation (HTML/CSS). Follow the `PascalCase` component naming convention.

### Vanilla Performance Optimization

- **Concept:** Dedication to "lean and fast" without reliance on heavy frameworks.
- **Action:** Write high-performance vanilla CSS and minimal JavaScript. Avoid introducing utility-first CSS frameworks or large runtime libraries unless absolutely mission-critical.

### Automated Quality Assurance

- **Concept:** Continuous verification through the project's testing and linting suite.
- **Action:** Proactively run Vitest suites (`npm test`) and maintain high code coverage. Enforce Prettier formatting and ESLint rules before every submission.

### Persona & Context Alignment

- **Concept:** Deep understanding of the author's professional profile and project goals.
- **Action:** Regularly consult `context/` and `README.md` to ensure all content updates, bio changes, or project descriptions align with Alexander Härenstam's real-world expertise in Product Management and Developer Experience.

## 6. Deployment & CI/CD

- **CI:** GitHub Actions (`ci.yml`) runs linting, formatting checks, tests, and builds on every PR.
- **CD:** Cloudflare automatically deploys pushes to `main` through its Git integration.
- **Release:** GitHub Actions runs `scripts/release.js` on `main`, commits the generated release artifacts, and creates the GitHub release for that version.
