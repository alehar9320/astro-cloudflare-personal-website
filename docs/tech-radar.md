# Repository Tech Radar

## Overview

This Tech Radar documents the key technologies, runtimes, infrastructure, tools, and architectural patterns used in Alexander Härenstam's personal portfolio repository (`molecular-mars`). It serves as an explicit ground-truth reference for human developers and autonomous AI agents.

---

## Quadrants

### 1. Frameworks & Runtimes

- **Adopt:**
  - **Astro (v7):** Core web framework used for static site generation (SSG) and server-side rendering (SSR) islands.
  - **TypeScript:** Primary language across client, edge worker, and build scripts.
  - **Cloudflare Workers / Edge Runtime:** Primary production runtime target using `@astrojs/cloudflare`.
- **Trial:**
  - **Node.js (@astrojs/node):** Secondary runtime used strictly for isolated Jules AI test environment execution on Render (`RENDER=true`).
- **Assess:**
  - **WebGPU / WebGL Canvas:** Lightweight native canvas visual elements for interactive experimental routes.
- **Hold:**
  - **React / Vue / Svelte Framework Hydration:** Banned from core UI components to maintain minimal client JS bundle footprint.
  - **Tailwind CSS / External CSS Frameworks:** Strict Vanilla CSS with scoped styles is enforced.

### 2. Infrastructure & Cloud

- **Adopt:**
  - **Cloudflare Workers / Pages:** Production deployment host (`me.alehar.workers.dev`).
  - **Cloudflare Workers KV:** Edge key-value store for analytics and visit metrics.
  - **Sentry:** Production error tracking and monitoring (`@sentry/cloudflare`, `@sentry/astro`).
- **Trial:**
  - **Render:** Secondary test environment host dedicated to automated agent testing.
- **Assess:**
  - **Cloudflare Vectorize / AI Workers:** Edge AI inference options for potential future assistant extensions.
- **Hold:**
  - **AWS / GCP / Vercel Deployments:** Cloudflare Workers is the sole production environment.

### 3. Tooling & AI Workflows

- **Adopt:**
  - **Vitest:** Primary unit and integration test runner (`npm test`).
  - **Prettier & ESLint:** Standardized code formatting and linting (`npm run format`, `npm run lint`).
  - **PostHog:** Client-side privacy-first user behavior analytics (`posthog-js`).
  - **Husky & lint-staged:** Git hook management for pre-commit sanity checks.
  - **Autonomous AI Agents (Jules, Archie, Kinetic, etc.):** Autonomous GitHub PR workflows governed by AGENTS.md and ADRs.
- **Trial:**
  - **Codecov:** Automated test coverage and bundle analysis reports.
- **Assess:**
  - **MCP (Model Context Protocol):** AI agent protocol capabilities.
- **Hold:**
  - **Jest / Mocha / Jasmine:** Vitest is the sole unit testing framework.

### 4. Patterns & Architecture

- **Adopt:**
  - **Type-Safe Content Collections & Zod Schemas:** All structured markdown and JSON configuration loaded via Astro content collections (`src/content.config.ts`).
  - **Static Feature Flags:** Isolate experimental routes and UI micro-interactions behind static JSON flags (`src/content/flags/config.json`).
  - **Module-Level Intl.DateTimeFormat Hoisting:** Eliminate repeated ICU locale initialization GC overhead in edge runtime requests.
  - **Zero-Allocation ISO Date Slicing:** Use `toISOString().slice(0, 10)` instead of string array allocations in edge handlers.
- **Trial:**
  - **Pre-Computed Hashtable Column Indexing:** O(1) field lookup maps for tabular API parsing.
- **Assess:**
  - **Astro Client-Side View Transitions (`astro:before-swap`):** Canvas teardown and memory cleanup on soft navigation.
- **Hold:**
  - **Global State Management Libraries (Redux, Zustand, Pinia):** Unnecessary for static portfolio architecture; native Web APIs or URL state preferred.
