# 0002. Workers-First Static Astro Architecture

- **Status:** Accepted
- **Date:** 2026-03-30
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

The repository operates as a high-performance portfolio site using Astro with static pre-rendering (`output: "static"`). The deployment model relies on Cloudflare Workers + Assets (`wrangler.jsonc`) as the primary production runtime, paired with pure Vanilla CSS for styling and Zod for strict content/data schema validation. Uncoordinated changes by developers or AI agents risk introducing runtime incompatibilities (such as legacy Cloudflare Pages assumptions, third-party CSS frameworks, or loose type casting).

## Decision

We formally accept and codify the following core architectural patterns:

1. **Workers-First Deployment Model:** Production runtime strictly utilizes Cloudflare Workers + Assets (`wrangler.jsonc`).
2. **Static Pre-Rendering Strategy:** Default to static output in Astro (`output: "static"` in `astro.config.mjs`) for optimal edge CDN caching and minimal cold starts.
3. **Vanilla CSS Styling:** Styling must strictly use Vanilla CSS with CSS custom properties and hardware-accelerated animations, preserving the 'Northern Lights' glassmorphic aesthetic.
4. **Strict Schema & Type Enforcement:** Zod must be used for all content collection schemas and API payload validations.

## Consequences & Tradeoffs

- **Positive:** Maximum edge caching performance, deterministic static builds, zero CSS framework overhead, and zero runtime schema type errors.
- **Negative / Risks:** Developers must write custom CSS rather than relying on utility classes; dynamic server-rendered features require explicit edge worker binding configurations.
- **Adoption Readiness:** Already fully implemented and active in production; codifying it provides an explicit ground truth for developers and AI agents.

## Directives for AI Agents

- **Do:**
  - Use Cloudflare Workers + Assets binding format in `wrangler.jsonc`.
  - Define content schemas with Zod in `src/content.config.ts`.
  - Use Vanilla CSS with scoped custom properties for all styling.
  - Run `npm run format`, `npm run lint`, `npm run check`, and `npm run test` before submitting changes.
- **Don't:**
  - NEVER introduce Tailwind CSS, Bootstrap, or other external CSS frameworks.
  - NEVER use legacy Cloudflare Pages configuration formats (`_routes.json`, `_headers` for Pages).
  - NEVER add new top-level runtime npm dependencies without explicit project clearance.
  - NEVER use `any` or `@ts-ignore` to bypass TypeScript strict type checks.
