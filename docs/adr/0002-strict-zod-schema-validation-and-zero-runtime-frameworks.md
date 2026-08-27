# 0002. Strict Zod Schema Validation & Zero-Runtime UI Frameworks

- **Status:** Accepted
- **Date:** 2026-03-30
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

The personal portfolio manages content collections (work experience, projects, publications, feature flags) and runtime data bindings. To guarantee edge performance, zero runtime regressions, and robust type safety across human and AI agent contributions, the repository requires strict schema validation and ultra-lean asset delivery without client-side heavy framework overhead.

## Decision

1. Enforce strict Zod schema definitions (`zod`) for all content collections in `src/content.config.ts`, feature flags, and environment configurations.
2. Maintain a zero-runtime UI framework architecture: all visual components use Astro static HTML rendering and native Vanilla CSS (`src/styles/`), prohibiting third-party UI component frameworks (React, Vue, Svelte, Solid) and utility-first CSS frameworks (Tailwind CSS).

## Consequences & Tradeoffs

- **Positive:**
  - Sub-millisecond static HTML rendering and minimal client JavaScript payload size.
  - Compile-time and runtime validation prevents malformed content frontmatter from reaching production.
  - Consistent, maintainable design system built on CSS custom properties and 'Northern Lights' glassmorphic aesthetic.
- **Negative / Risks:**
  - Complex interactive components require custom vanilla JavaScript DOM manipulation and event lifecycle management.
  - CSS design tokens must be maintained in Vanilla CSS without framework utility classes.
- **Adoption Readiness:** Fully established and validated by test suite (`src/__tests__/content.config.test.ts`).

## Directives for AI Agents

- **Do:**
  - Use Zod schemas in `src/content.config.ts` for all content collection frontmatter and structured data validation.
  - Write scoped Vanilla CSS inside Astro `<style>` tags or shared stylesheets in `src/styles/`.
  - Ensure all client scripts in Astro components attach event listeners cleanly and handle teardown/re-initialization for View Transitions (`astro:page-load`).
- **Don't:**
  - DO NOT introduce React, Vue, Svelte, Solid, or Tailwind CSS dependencies into `package.json`.
  - DO NOT use `any`, `@ts-ignore`, or unsafe type casts to bypass Zod schema constraints.
  - DO NOT modify `src/content.config.ts` schemas without updating matching tests in `src/__tests__/content.config.test.ts`.
