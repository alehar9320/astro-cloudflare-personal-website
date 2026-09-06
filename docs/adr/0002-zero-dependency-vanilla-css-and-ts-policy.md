# 0002. Zero-Dependency Vanilla CSS and Pure TypeScript Policy

- **Status:** Accepted
- **Date:** 2026-09-06
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

To preserve performance, minimize bundle sizes, prevent supply-chain vulnerabilities, and ensure seamless operation on Cloudflare Workers edge runtime, the repository strictly limits third-party runtime dependencies. UI styling relies on scoped Vanilla CSS adhering to the personal portfolio's aesthetic, and logic utilities are written in native TypeScript without external utility libraries (e.g., Lodash, Ramda, or utility-first CSS frameworks like Tailwind).

## Decision

All UI styling must use pure Vanilla CSS with standard CSS design tokens. All application utilities, math/physics routines, and state helpers must be written natively in pure TypeScript. No new third-party dependencies may be added to `package.json` without explicit architectural review.

## Consequences & Tradeoffs

- **Positive:** Fast edge runtime execution, zero bundle bloat, zero CSS framework overhead, minimal security vulnerabilities, and optimal cold-start performance on Cloudflare Workers.
- **Negative / Risks:** Development of complex UI components or mathematical utilities requires custom implementation rather than pulling in external NPM packages.
- **Adoption Readiness:** Already universally practiced across component styles (`src/components/`, `src/styles/`) and helper scripts (`src/utils/`).

## Directives for AI Agents

- **Do:**
  - Write pure Vanilla CSS scoped within Astro components or in `src/styles/`.
  - Use modern CSS features (CSS variables, CSS grid, flexbox, `:focus-visible`, hardware-accelerated transforms).
  - Write utility logic natively in pure TypeScript.
- **Don't:**
  - Do not introduce CSS frameworks (e.g., Tailwind, Bootstrap) or UI component libraries.
  - Do not add third-party runtime dependencies to `package.json`.
  - Do not use `@ts-ignore` or `any` in TypeScript files.
