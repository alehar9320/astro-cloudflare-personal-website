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
4. **Edge Pre-rendering:** Default to static pre-rendering (`output: 'static'`) for optimal edge performance unless dynamic data at request-time is mission-critical.
