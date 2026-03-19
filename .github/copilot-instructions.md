# Copilot instructions — astro-cloudflare-personal-website

Purpose: Give future Copilot sessions quick, actionable context for building, testing, linting, and understanding repository conventions.

---

## Quick commands

- Install dependencies: npm install
- Dev server: npm run dev (Astro local server at http://localhost:4321)
- Build (production): npm run build (outputs ./dist)
- Preview build: npm run preview
- Run tests: npm run test (uses Vitest)
- Lint: npm run lint (eslint .)
- Format: npm run format (Prettier)
- Generate Cloudflare types: npm run generate-types (wrangler types)

Running a single test

- By file: npm run test -- src/path/to/file.test.ts
- Direct with Vitest: npx vitest run src/path/to/file.test.ts
- By test name: npx vitest -t "partial test name" --run

Notes: npm scripts forward arguments after `--` to the underlying command.

---

## High-level architecture

- Framework: Astro site (astro.config.mjs) using @astrojs/cloudflare adapter.
- Hosting: Built for Cloudflare Pages / Workers. wrangler.jsonc config points at the Cloudflare entrypoint and binds `ASSETS` -> ./dist.
- Content-first: Uses Astro Content Collections (src/content and src/content.config.ts). Collections have Zod schemas (see `work` collection schema).
- Source layout:
  - src/pages — route-level pages
  - src/layouts — page/layout components
  - src/components — UI components
  - src/content — Markdown content (collections)
  - src/styles — global styles
- Build flow: `astro build` -> outputs to ./dist; Cloudflare/Wrangler publishes the built assets as a Worker-backed site.
- Test tooling: Vitest configured (vitest.config.ts) to run in jsdom and to include .astro files in tests.

---

## Key conventions (repo-specific)

- Content schema: `src/content.config.ts` defines a `work` collection. Frontmatter expected fields: `title`, `description`, `publishDate`, `tags`, `img`, optional `img_alt`.
- Tests may import or render .astro files. Vitest's `include` includes `src/**/*.{test,spec}.{js,ts,jsx,tsx,astro}` so test filenames follow `.test.` or `.spec.` convention and can target .astro components.
- Node engine: package.json requires Node >= 22.12.0. Use the engine in CI/dev environments.
- ESLint: `eslint.config.mjs` composes TypeScript and Astro recommended configs and ignores `dist`, `.astro`, `node_modules`, and `env.d.ts`.
- Formatting: Prettier with `prettier-plugin-astro` is used for .astro formatting.
- Husky + lint-staged present (prepare script) — hooks may run linting/formatting on commit.
- Passing args: Use `npm run <script> -- <args>` to forward args to the underlying tool (Vitest, ESLint, etc.).

---

## Important files to check when modifying behavior

- package.json — scripts and engine
- astro.config.mjs — Astro config and adapter
- wrangler.jsonc — Cloudflare/Wrangler entrypoint and assets binding
- src/content.config.ts — content collection schemas
- vitest.config.ts — test environment and include patterns
- eslint.config.mjs — ESLint composition and ignore rules

---

## MCP servers

- This repo contains mcp_config.json with an `astro-docs` MCP server configured. See `mcp_config.json` at project root.

---

If anything here should be expanded (examples of running specific tests, CI notes, or more collection schemas), say what to add and an updated version will be created.
