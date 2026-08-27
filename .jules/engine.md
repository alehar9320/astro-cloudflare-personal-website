# ⚙️ Engine Journal

## 2025-05-14 - Centralized Chat Logic & Pruning

- **Architectural Shift:** Centralized chat-related constants and logic into `src/utils/chat-logic.ts` to ensure consistency between the API and potential future client-side pruning.
- **New Utility:** Established `pruneMessages` which implements a sliding window algorithm to maintain conversation history within Cloudflare Workers AI limits (10 messages, 3000 total characters).
- **TypeScript & Validation:** Leveraged Zod for strict schema validation of chat requests and messages, ensuring runtime safety and defensive error handling.
- **Performance:** Pruning happens on the edge to minimize payload size sent to the AI model, improving response latency and reliability.

## 2025-05-21 - Hardened SSE Stream Parsing & Type Guarding

- **Architectural Shift & Resilience:** Hardened `extractResponseFromPayload` in `src/utils/chat-stream.ts` to defend against non-string response fields, unexpected payload whitespace, and SSE comment lines like `: heartbeat`.
- **TypeScript & Type Guarding:** Implemented custom type guards for Zod content schema validations (`isSchemaWithSafeParse`) in `src/__tests__/content.config.test.ts` and ambient type declarations in `src/env.d.ts` for Node environment compatibility.
- **Testing Guardrails:** Extended unit tests in `src/utils/chat-stream.test.ts` to verify parser behavior under non-string `response` parameters (numbers, booleans, nested objects) and unhandled SSE frame boundary states.
