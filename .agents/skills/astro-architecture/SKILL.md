---
name: astro-architecture
description: Expert-level knowledge of the Astro framework. Use when working on Astro components, content collections, and routing.
---

# Astro Content Architecture

Ensure that the project's Astro framework implementation follows modern best practices for edge-based performance and content management.

## When to use this skill

- Creating or modifying Astro components (`.astro`).
- Working with Astro content collections and loaders.
- Configuring Astro routing or pre-rendering.
- Managing base layouts and global styles.

## How to use it

1. **Content First Architecture:** Leverage Astro's content layer for all data-driven components to ensure separation of content from presentation.
2. **Component Naming:** Follow the project convention: `PascalCase` for UI components (`MyComponent.astro`) and `kebab-case` for other files.
3. **Logic Separation:** Maintain a clear boundary between frontmatter logic (the Astro script block) and the HTML/CSS presentation.
4. **Hybrid Strategy:** Default to `output: 'static'` (In Astro 6+, static is the new hybrid). Pre-render all static content. Reserve `export const prerender = false` only for routes that require dynamic request-time processing (headers, auth, etc.).
5. **Environment Parity:** Always set `adapter: cloudflare({ prerenderEnvironment: 'workerd' })` in `astro.config.mjs` to ensure build-time logic matches the edge runtime.
6. **Edge Image Optimization:** Use `imageService: 'cloudflare-binding'` in the Astro config to leverage edge-native image processing.
