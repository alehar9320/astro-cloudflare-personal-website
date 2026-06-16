# ⚙️ Engine Journal

## 2025-05-14 - Centralized Chat Logic & Pruning

- **Architectural Shift:** Centralized chat-related constants and logic into `src/utils/chat-logic.ts` to ensure consistency between the API and potential future client-side pruning.
- **New Utility:** Established `pruneMessages` which implements a sliding window algorithm to maintain conversation history within Cloudflare Workers AI limits (10 messages, 3000 total characters).
- **TypeScript & Validation:** Leveraged Zod for strict schema validation of chat requests and messages, ensuring runtime safety and defensive error handling.
- **Performance:** Pruning happens on the edge to minimize payload size sent to the AI model, improving response latency and reliability.

## 2025-05-16 - API Hardening & Type Reconciliation

- **Security & Telemetry:** Implemented `sanitizeZodIssues` utility to redact PII (`received`, `value`) from Zod validation error logs, preventing sensitive user content from leaking into structured telemetry.
- **Client-Side Hardening:** Integrated eager message pruning in `Chat.astro` and added a migration layer to normalize legacy chat history roles (e.g., `'ai'` -> `'assistant'`), ensuring backward compatibility.
- **Type Reconciliation:** Hardened `App.Locals` and `Env` type definitions to align with `@astrojs/cloudflare` v13 `runtime.env` access patterns, resolving a critical drift in build-time logic verification.
