---
name: context7
description: Use Context7 to fetch up-to-date, version-specific documentation and code examples for any library or API.
---

# Context7 Documentation Retrieval

Context7 is an MCP server that pulls real-time documentation and code examples straight from the source and places them directly into your context.

## When to use this skill

- When you need documentation for a specific library or framework (e.g., Astro, Cloudflare Workers, Zod).
- When you encounter hallucinated APIs or outdated code examples.
- When you need to understand the latest features or breaking changes in a package.
- When setting up or configuring new integrations.

## How to use it

1. **Explicit Library IDs:** If you know the library, use its Context7 ID (e.g., `/mongodb/docs`, `/vercel/next.js`).
2. **Natural Language Queries:** Use the `query-docs` tool with a descriptive question to find the right information.
3. **Resolve IDs:** If the ID is unknown, use `resolve-library-id` first to find the correct identifier.
4. **Agent Rule:** Always use Context7 when you need library/API documentation, code generation, setup or configuration steps without having to be explicitly asked.

## Examples

- "How do I set up Next.js 14 middleware? use context7"
- "Show me the Supabase auth API for email/password sign-up. use library /supabase/supabase"
