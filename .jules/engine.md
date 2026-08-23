# ⚙️ Engine Journal

## 2025-05-21 - TypeScript Diagnostics Hardening & Zod Issue Optimization

- **TypeScript & Validation:** Replaced deprecated `z.ZodIssue` types with `z.ZodError['issues']` in `src/utils/github-releases.ts`, eliminating compiler warnings under Zod v4 and strict TS checking.
- **Content Collection Schema Type Guarding:** Implemented `isSchemaWithSafeParse` type guard in `src/__tests__/content.config.test.ts` to satisfy Astro Content Collections schema union types without risky type assertions or `any` casts.
- **Astro Check Ambient Node Typings:** Added ambient type declarations for Node built-in modules (`node:fs`, `node:path`, `child_process`, `Buffer`, `process`) in `src/env.d.ts` to achieve 0 errors across all 80 files during `npm run astro check`.
- **DOM Method Standardization:** Standardized client-side component DOM node insertions in `src/components/Chat.astro` and `src/components/Footer.astro` to `appendChild`, eliminating type mismatch diagnostics across browser and Worker contexts.
- **Unit Testing:** Expanded Vitest unit test coverage in `src/utils/chat-logic.test.ts` for grounded answer generation and SSE stream encoding.

## 2025-05-14 - Centralized Chat Logic & Pruning

- **Architectural Shift:** Centralized chat-related constants and logic into `src/utils/chat-logic.ts` to ensure consistency between the API and potential future client-side pruning.
- **New Utility:** Established `pruneMessages` which implements a sliding window algorithm to maintain conversation history within Cloudflare Workers AI limits (10 messages, 3000 total characters).
- **TypeScript & Validation:** Leveraged Zod for strict schema validation of chat requests and messages, ensuring runtime safety and defensive error handling.
- **Performance:** Pruning happens on the edge to minimize payload size sent to the AI model, improving response latency and reliability.
