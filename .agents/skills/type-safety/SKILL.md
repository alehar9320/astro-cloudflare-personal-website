---
name: type-safety
description: Enforce strict TypeScript and schema integrity. Use when adding or modifying any TypeScript code or defining content collection schemas (Zod).
---

# Strict Type-Safety & Schema Integrity

Maintain a zero-tolerance policy for loose typing and ensure that all data is validated through robust schemas.

## When to use this skill

- Writing any new TypeScript code (`.ts` or `.astro`).
- Modifying `tsconfig.json` or project-wide typing.
- Updating `src/content.config.ts` or any Zod schemas.
- Working with environment variables and bindings.

## How to use it

1. **Strict Mode Compliance:** Always work within TypeScript's strict mode. Avoid the use of `any` or non-standard type casting.
2. **Schema-Driven Development:** When modifying content collections, ensure the Zod schema is updated first to maintain data integrity.
3. **Automated Type Generation:** For environment bindings, always run `npx wrangler types` to generate accurate types in `src/env.d.ts`.
4. **Validation:** Use `npm run astro check` regularly to verify project-wide type safety.
