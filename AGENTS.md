# AGENTS.md - AI Agent Source of Truth

## 1. Project Overview

- **Mission:** A personal portfolio website for Alexander Härenstam, showcasing professional journey, skills, projects, and publications. Built with a focus on speed, SEO, and modern web standards.
- **Stack:**
  - **Framework:** Astro (v4+)
- **Collaboration:** This site is co-created by humans and AI. It is intentionally optimized for consumption by both humans and AI agents (AEO/GEO).
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
- **Type Safety:** Strict TypeScript is mandatory. Use Zod for both compile-time and runtime validation. Run `npx wrangler types` after binding changes.
- **Naming Conventions:**
  - PascalCase for Astro components (`MyComponent.astro`).
  - kebab-case for other files (`my-script.ts`).
- **Icons:** Phosphor Icons adapted in `src/components/IconPaths.ts`.
- **MCP Servers:** Configured in `mcp_config.json` (root) and documented in `docs/mcp.md`. Includes `astro-docs`, `render`, and `context7` servers.

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
- **Release Source of Truth:** GitHub releases and tags are the canonical source for versioning and changelog history.
- **GitHub Actions Role:** CI validates changes on PRs and, on `main`, creates a GitHub release from `scripts/release.js`. It must not push generated release files back to protected `main`.
- **Footer + What's New:** The footer version link and `/whats-new` page consume GitHub release data rather than tracked repo artifacts.

## 4. AI Constraints (The "Never" List)

- **NEVER** add new top-level dependencies without explicit permission. (Zod is an exception as it's now a core dependency for validation).
- **NEVER** introduce Tailwind CSS or other CSS frameworks unless requested.
- **NEVER** commit secrets or modify `.dev.vars` in the repository.
- **NEVER** modify `wrangler.jsonc` without understanding the Workers-First model.
- **NEVER** commit code that fails `npm run format`, `npm run lint`, or `npm run build`.
- **NEVER** use deprecated Cloudflare Pages models; strictly follow the Workers + Assets binding pattern.
- **NEVER** add or preserve a parallel manual production deploy step in CI when Cloudflare Git auto-deploy already owns production releases.
- **NEVER** design automation that depends on direct writes back to protected `main` for release metadata.

## 5. AI Agent Skills

Project-specific AI agent skills are defined in the `.agents/skills/` directory. These skills provide focused instructions for:

- Edge-First Engineering (Cloudflare Workers + Assets)
- Strict Type-Safety & Schema Integrity (Powered by Zod)
- Astro Content Architecture
- Vanilla Performance Optimization
- Automated Quality Assurance
- Persona & Context Alignment
- Context7 Documentation Retrieval

Refer to the individual `SKILL.md` files in each skill folder for detailed guidance.

## 6. Deployment & CI/CD

- **CI:** GitHub Actions (`ci.yml`) runs linting, formatting checks, tests, and builds on every PR.
- **CD:** Cloudflare automatically deploys pushes to `main` through its Git integration.
- **Release:** GitHub Actions runs `scripts/release.js` on `main` and creates the GitHub release for that version without mutating `main`.
