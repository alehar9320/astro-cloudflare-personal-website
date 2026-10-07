# Repository Tech Radar

This Tech Radar reflects the technology choices, architectural patterns, and development tooling governing Alexander Härenstam's personal portfolio repository.

## Quadrants

### 1. Frameworks & Runtimes

- **Adopt:**
  - **Astro:** Primary web framework for static site generation, content collections, and island hydration.
  - **Cloudflare Workers:** Production execution environment delivering edge performance.
  - **TypeScript:** Strict type-safety across all application code, components, and utilities.
- **Trial:**
  - **Node.js Runtime (Render):** Isolated Node server runtime reserved strictly for Google Jules debugging environment (`RENDER=true`).

### 2. Infrastructure & Cloud

- **Adopt:**
  - **Cloudflare Edge Platform:** Static asset hosting and Cloudflare Worker edge routing.
- **Trial:**
  - **Render.com:** Alternative hosting sandbox used for Jules test environment verification.

### 3. Tooling & AI Workflows

- **Adopt:**
  - **Vitest:** Fast unit test runner for business logic, utilities, and content schema validation.
  - **Prettier & ESLint:** Code formatting and static code analysis enforcement.
  - **Autonomous AI Agents (Jules, Archie, Bolt, Kinetic, Palette, Sentinel, etc.):** Role-bounded autonomous agents operating under strictly defined directives in `.Jules/`.

### 4. Patterns & Architecture

- **Adopt:**
  - **Static Feature Flags:** Feature gating via `src/content/flags/config.json` and Zod-validated Astro content collections (ADR 0002).
  - **Safe JSON-LD Serialization:** Replacing `<` with `\u003c` during JSON-LD stringification to prevent HTML injection / script breakout vectors.
  - **Canvas Lifecycle Management:** Canvas initialization guards (`data-initialized`) and event teardown on `astro:before-swap` and `visibilitychange`.
  - **ISO Date String Slicing:** Extracting `YYYY-MM-DD` using `.toISOString().slice(0, 10)` to eliminate intermediate array allocations.
- **Assess:**
  - **Experimental Canvas Laboratory (`src/pages/lab/`):** Dynamic WebGL and particle canvas experiments isolated from production user paths.
- **Hold:**
  - **Third-Party Client UI Frameworks:** Banned dynamic UI frameworks (e.g. React, Vue, Tailwind, Framer Motion) to maintain zero unnecessary client-side JavaScript bundle overhead.
