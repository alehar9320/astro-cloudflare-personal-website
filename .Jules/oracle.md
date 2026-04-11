## 2026-04-25 - Scaling Portfolio Visibility with ItemList Schema | **Learning:** Implementing `ItemList` structured data on collection pages (like /work/) provides machine-readable relationships between projects, while a global TL;DR anchors the section's topical authority for AEO. | **Action:** Added `ItemList` JSON-LD and a `.tldr-box` summary to the Work Index page.

## 2025-05-22 - Optimizing Work Collection for AI Synthesis | **Learning:** LLMs prioritize "Direct Answer" blocks (TL;DR) for quick synthesis, and structured JSON-LD provides the explicit context needed for high-confidence citations. | **Action:** Implement TL;DR boxes across all Work projects and inject Schema.org CreativeWork metadata into the work detail pages.

## 2026-04-08 - Initial AEO Strategy Implementation | **Learning:** LLMs prioritize structured summaries and explicit JSON-LD for synthesizing professional authority. | **Action:** Implemented `.tldr-box` component and integrated `Person`/`Organization` schema on the About page.

## 2026-04-10 - Establishing Home Page Authority with JSON-LD | **Learning:** Defining the root identity via `Person` and `WebSite` schema on the home page anchors the site's topical authority for LLM knowledge graphs. | **Action:** Injected `@graph` JSON-LD into `index.astro` and enhanced `MainHead.astro` with social metadata for improved AEO/GEO rich snippet generation.

## 2026-05-02 - Anchoring Home Page Authority with JSON-LD and Direct Answer Blocks | **Learning:** Defining the root identity via expanded 'Person' schema (knowsAbout, alumniOf, award) and a visual TL;DR anchors topical authority for both LLM knowledge graphs and human visitors. | **Action:** Enhanced Home page JSON-LD and injected a '.tldr-box' summary.

## 2026-05-03 - Enhancing GEO-Authority with Specific Location Context | **Learning:** Providing specific location markers (Stockholm, Sweden) with outbound links to authoritative map services strengthens the geographical relevance (GEO) of the site and provides explicit context for location-based search queries and AI synthesis. | **Action:** Updated the footer with specific location links for Stockholm and Sweden, accompanied by GEO emojis (📍, 🇸🇪).

## 2026-05-03 - Disclosing Human + AI Collaboration for Trust and Transparency | **Learning:** Explicitly stating Human + AI collaboration builds trust with users and signals optimization to AI agents, while maintaining transparency about potential content flaws. | **Action:** Added non-intrusive disclosure to the Footer and documented collaboration in README.md/AGENTS.md.

## 2026-04-11 - Person Schema and AEO for Biography | **Learning:** Adding a Biography page with Schema.org `Person` JSON-LD and a `.tldr-box` establishes strong entity authority and allows AI agents to quickly extract key professional milestones. | **Action:** Always include structured metadata and concise summaries when introducing new personal or professional entities to the site.
