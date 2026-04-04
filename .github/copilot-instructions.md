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
- Format code: npm run format (Prettier — **required before commit**)
- Check formatting: npm run format:check (validate without changes — used in CI)
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
- Formatting: Prettier with `prettier-plugin-astro` is used for .astro formatting. **Prettier is mandatory — run `npm run format` after making changes and before committing.**
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

## Code Formatting & Prettier Requirements

**Prettier is mandatory for all code changes.** The CI pipeline enforces this via the `format:check` script in the quality job. Non-compliant formatting will cause PR checks to fail.

### Why Prettier?

- Ensures consistent code style across the project
- Eliminates formatting discussions in code reviews
- Integrates seamlessly with Husky pre-commit hooks
- Covers all file types: `.js`, `.ts`, `.astro`, `.css`, `.md`, `.json`
- Configuration: `.prettierrc.json` + `prettier-plugin-astro`

### Formatting Workflow

**Before you commit or submit a PR, always:**

1. Apply formatting: `npm run format`
2. Verify formatting: `npm run format:check` (should pass silently)
3. If step 2 reports issues, step 1 will fix them; re-verify with step 2
4. Commit your changes

### Commands Reference

- `npm run format` — Apply prettier formatting to all eligible files
- `npm run format:check` — Validate that all files conform to prettier rules (used in CI)
- `npm run lint` — Run ESLint (can auto-fix some issues with `--fix`)

### Platform-Specific Tips

**GitHub Copilot & Copilot Chat:**

- After code generation, explicitly request: "Please format this with prettier."
- If providing code in a comment, ask Copilot to "apply prettier before committing."

**Cursor:**

- Enable "Format on Save" with Prettier: Set `editor.formatOnSave: true` and `editor.defaultFormatter: "esbenp.prettier-vscode"` in settings
- Install the Prettier VS Code extension if not already present

**Claude/Similar APIs:**

- After generating code, explicitly instruct: "Run `npm run format` to ensure prettier compliance."
- Before submission, validate: "Verify with `npm run format:check`."

**Antigravity, Jules, Codex, etc.:**

- Insert this instruction: "Always apply prettier formatting before returning code."
- Provide this command: "Run `npm run format && npm run format:check` before submitting."

### Pre-PR Checklist for AI Agents

Before submitting code for a pull request:

- ✅ Code changes are complete and tested
- ✅ `npm run format` has been run successfully
- ✅ `npm run format:check` passes without errors
- ✅ `npm run lint` passes (no ESLint violations)
- ✅ `npm run test` passes (if tests exist)
- ✅ `npm run build` succeeds without warnings

**If any formatting issues remain after `npm run format`, they will block the CI quality gate.**

---

## MCP servers

- This repo contains mcp_config.json with an `astro-docs` MCP server configured. See `mcp_config.json` at project root.

---

If anything here should be expanded (examples of running specific tests, CI notes, or more collection schemas), say what to add and an updated version will be created.
