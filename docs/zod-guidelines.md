# Zod Best Practices & Guidelines

This project leverages [Zod](https://zod.dev) for TypeScript-first schema declaration and runtime type validation. These guidelines ensure consistency and reliability for both humans and AI agents.

## Core Principles

1.  **Schema-First Design:** Define the shape of your data using Zod schemas before implementation.
2.  **Runtime Validation:** Never trust external data (APIs, user input, environment variables). Always validate at the boundary.
3.  **Type Inference:** Use `z.infer<typeof schema>` to derive TypeScript types from schemas, maintaining a single source of truth.
4.  **Fail Fast:** Use `.parse()` or `.safeParse()` immediately when data enters the system.

## Implementation Guidelines

### 1. Content Collections

Astro content collections use Zod for schema validation. Always define strict schemas in `src/content.config.ts`.

```typescript
// src/content.config.ts
import { z } from 'astro/zod';

export const collections = {
  work: defineCollection({
    schema: z.object({
      title: z.string(),
      publishDate: z.coerce.date(),
      tags: z.array(z.string()),
      // Always include alt text for accessibility
      img_alt: z.string().min(1),
    }),
  }),
};
```

### 2. API Request Validation

When handling requests in API routes (e.g., `src/pages/api/*.ts`), validate the payload immediately.

```typescript
import { z } from 'zod';

const RequestSchema = z.object({
  message: z.string().max(1000),
  stream: z.boolean().optional().default(false),
});

export async function POST({ request }) {
  const body = await request.json();
  const result = RequestSchema.safeParse(body);

  if (!result.success) {
    return new Response(JSON.stringify({ error: result.error.format() }), { status: 400 });
  }

  const { message, stream } = result.data; // Type-safe data
}
```

### 3. Environment Variables

Validate environment variables to prevent runtime crashes due to missing configuration.

```typescript
const EnvSchema = z.object({
  API_KEY: z.string().min(1),
  NODE_ENV: z.enum(['development', 'production']).default('development'),
});

const env = EnvSchema.parse(process.env);
```

## Best Practices

- **Use `.coerce` for Input:** Use `z.coerce.date()` or `z.coerce.number()` when data might come in as strings (e.g., from search params or Markdown frontmatter).
- **Descriptive Errors:** Use `.min(1, "Title is required")` to provide helpful error messages.
- **Refinement:** Use `.refine()` for complex validation logic that depends on multiple fields.
- **Avoid `any`:** Never cast a Zod result to `any`. The whole point of Zod is to escape the `any` trap.
- **Keep it DRY:** Export and reuse common schemas (e.g., a `UUID` schema or `Pagination` schema) across the project.

## AI Agent Instructions

When acting as an AI agent in this repository:

- **Audit existing schemas** before making changes to data structures.
- **Propose schema changes** first when introducing new data requirements.
- **Always implement validation** when fetching data from external MCP tools or APIs.
- **Verify types** by running `npm run astro check` after modifying schemas.
