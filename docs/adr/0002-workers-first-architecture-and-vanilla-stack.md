# 0002. Workers-First Astro Static Architecture and Zero-Dependency Vanilla Stack

- **Status:** Accepted
- **Date:** 2026-03-29
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

Alexander Härenstam's personal portfolio requires sub-second edge load times, zero layout shifts (CLS=0), WCAG 2.1 AA accessibility compliance, and high predictability for autonomous AI agents. Modern web development frequently suffers from dependency bloat, framework churn (e.g., heavy client-side React/Vue hydration), and bulky CSS frameworks (e.g., Tailwind CSS) that introduce bundle overhead and break scoped styling isolation.

## Decision

The repository adopts a Workers-First static Astro architecture with a zero-dependency Vanilla stack:

1. **Framework & Output:** Astro v4+ configured for static pre-rendering (`output: "static"`) deployed via Cloudflare Workers + Assets (`wrangler.jsonc`).
2. **Styling:** Strictly Vanilla scoped CSS using standard CSS custom properties (design tokens) and glassmorphic 'Northern Lights' tokens. No Tailwind CSS or external CSS utility frameworks.
3. **Runtime & Hydration:** Zero heavy client JS frameworks (no React, Vue, Svelte, or Solid). Interactive client elements must use native HTML5 Web APIs, Vanilla TypeScript, or isolated Astro island components.
4. **Type Safety & Data Schemas:** Strict TypeScript enforced with runtime/compile-time Zod schema validation across content collections (`src/content.config.ts`) and API route handlers.

## Consequences & Tradeoffs

- **Positive:**
  - Maximizes edge performance, minimal client bundle footprint, and 60fps animations.
  - Guarantees total visual and code predictability for autonomous AI agents without framework abstraction layers.
  - Simplifies long-term maintenance and eliminates third-party security vulnerabilities and supply-chain drift.
- **Negative / Risks:**
  - Requires authoring component styles natively in Vanilla CSS without utility class shortcuts.
  - Interactive UI components must be built natively using DOM APIs or Web Components rather than pulling off-the-shelf React libraries.
- **Adoption Readiness:** Fully adopted across production codebase (`src/pages`, `src/components`, `src/styles`).

## Directives for AI Agents

- **Do:**
  - Author all component styles using Vanilla CSS inside Astro `<style>` tags or shared stylesheets in `src/styles/`.
  - Validate all structured data and content structures using Zod schemas in `src/content.config.ts` or API endpoints.
  - Write strict, type-safe TypeScript code with explicit return types and no `any` or `@ts-ignore`.
  - Maintain hardware-accelerated animations (`transform`, `opacity`) wrapped in `@media (prefers-reduced-motion: no-preference)`.
- **Don't:**
  - Do NOT install or introduce Tailwind CSS, Bootstrap, or any utility-first CSS framework.
  - Do NOT add third-party client UI libraries (React, Vue, Svelte, Tailwind UI, Framer Motion, Radix UI).
  - Do NOT use `client:load` or `client:only` when static HTML or lightweight CSS transitions suffice.
  - Do NOT bypass Zod schema parsing or TypeScript strict mode rules.
