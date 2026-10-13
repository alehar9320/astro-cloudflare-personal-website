# Repository Tech Radar

## Quadrants

1. **Frameworks & Runtimes**
   - Astro (`Adopt`)
   - Cloudflare Workers (`Adopt`)
   - TypeScript (`Adopt`)
   - Node.js (`Trial` - strictly restricted to Render Jules test environment)

2. **Infrastructure & Cloud**
   - Cloudflare Workers & Assets Binding (`Adopt`)
   - Render (`Trial` - strictly restricted to test/debugging environment)

3. **Tooling & AI Workflows**
   - Vitest (`Adopt`)
   - Prettier (`Adopt`)
   - ESLint (`Adopt`)
   - Google Jules Autonomous Agents (`Adopt`)

4. **Patterns & Architecture**
   - Static Pre-Rendering with Edge Endpoints (`Adopt`)
   - Content Collections & Zod Schema Validation (`Adopt`)
   - Static JSON Feature Toggles (`Adopt`)
   - Scoped CSS & Glassmorphism Theme (`Adopt`)
   - Tailwind CSS (`Hold` - Vanilla CSS strictly required)

## Rings

- **Adopt:** High confidence, production-proven in this repo. Default choice for new work.
- **Trial:** High potential with low risk. Ready for isolated usage in minor features or scripts.
- **Assess:** Worth tracking and evaluating trade-offs; not yet recommended for active production code.
- **Hold:** Phasing out or proven problematic in our setup. Do not use for new work.
