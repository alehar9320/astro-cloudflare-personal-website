# 0002. Zero-Dependency Vanilla CSS & Native Web API Island Architecture

- **Status:** Accepted
- **Date:** 2026-03-30
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

The repository aims for maximum edge performance, minimal bundle size, high Core Web Vitals scores, and zero framework lock-in or client-side runtime hydration overhead. Heavy client-side UI frameworks (React, Vue, Svelte) and utility CSS frameworks (Tailwind, Bootstrap) add bundle bloat, build complexity, and unnecessary client JS execution on edge runtimes like Cloudflare Workers.

## Decision

All UI styling and interactive features must be built strictly using Vanilla CSS (scoped within Astro components or root tokens) and native Web APIs (Canvas, Pointer Events, IntersectionObserver, standard DOM). Interactive elements must use passive static island hydration (`client:visible` or passive vanilla JS scripts with teardown on `astro:before-swap`). Experimental UI components and feature variations must be controlled via static feature flags (`src/content/flags/config.json`) or dedicated routes (`src/pages/experimental/`).

## Consequences & Tradeoffs

- **Positive:** Zero client JS library overhead, ultra-fast initial page load, deterministic CSS scoping, and complete compatibility with Cloudflare Workers edge delivery.
- **Negative / Risks:** Developers and AI agents must author custom Vanilla CSS and Web API logic rather than relying on ready-made UI component libraries or Tailwind utilities.
- **Adoption Readiness:** Embedded across all core Astro pages, visual canvas elements, and feature flags in the repo.

## Directives for AI Agents

- **Do:** Write pure Vanilla CSS scoped inside Astro component `<style>` blocks or global root tokens in `src/styles/`.
- **Do:** Use native Web APIs (HTML5 Canvas, CSS transitions/animations, standard DOM events) for micro-interactions and animations.
- **Do:** Implement proper component teardown (e.g., removing `requestAnimationFrame` loops or event listeners on `astro:before-swap`) for client script lifecycles.
- **Do:** Isolate experimental or unreleased features behind static feature flags (`src/content/flags/config.json`) or experimental routes (`src/pages/experimental/`).
- **Don't:** Introduce Tailwind CSS, SCSS, or external UI component libraries (React, Vue, Svelte, DaisyUI, etc.).
- **Don't:** Add third-party JavaScript animation libraries (GSAP, Framer Motion, Three.js, Lottie).
- **Don't:** Hydrate components with `client:load` or `client:only` when static HTML or passive CSS/vanilla JS suffices.
