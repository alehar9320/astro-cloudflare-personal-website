## 2026-04-25 - Scaling Portfolio Visibility with ItemList Schema | **Learning:** Implementing `ItemList` structured data on collection pages (like /work/) provides machine-readable relationships between projects, while a global TL;DR anchors the section's topical authority for AEO. | **Action:** Added `ItemList` JSON-LD and a `.tldr-box` summary to the Work Index page.

## 2025-05-22 - Optimizing Work Collection for AI Synthesis | **Learning:** LLMs prioritize "Direct Answer" blocks (TL;DR) for quick synthesis, and structured JSON-LD provides the explicit context needed for high-confidence citations. | **Action:** Implement TL;DR boxes across all Work projects and inject Schema.org CreativeWork metadata into the work detail pages.

## 2026-04-08 - Initial AEO Strategy Implementation | **Learning:** LLMs prioritize structured summaries and explicit JSON-LD for synthesizing professional authority. | **Action:** Implemented `.tldr-box` component and integrated `Person`/`Organization` schema on the About page.

## 2026-04-10 - Establishing Home Page Authority with JSON-LD | **Learning:** Defining the root identity via `Person` and `WebSite` schema on the home page anchors the site's topical authority for LLM knowledge graphs. | **Action:** Injected `@graph` JSON-LD into `index.astro` and enhanced `MainHead.astro` with social metadata for improved AEO/GEO rich snippet generation.

## 2026-05-02 - Anchoring Home Page Authority with JSON-LD and Direct Answer Blocks | **Learning:** Defining the root identity via expanded 'Person' schema (knowsAbout, alumniOf, award) and a visual TL;DR anchors topical authority for both LLM knowledge graphs and human visitors. | **Action:** Enhanced Home page JSON-LD and injected a '.tldr-box' summary.
