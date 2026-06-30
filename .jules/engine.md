# ⚙️ Engine Journal

## 2025-05-14 - Centralized Chat Logic & Pruning

- **Architectural Shift:** Centralized chat-related constants and logic into `src/utils/chat-logic.ts` to ensure consistency between the API and potential future client-side pruning.
- **New Utility:** Established `pruneMessages` which implements a sliding window algorithm to maintain conversation history within Cloudflare Workers AI limits (10 messages, 3000 total characters).
- **TypeScript & Validation:** Leveraged Zod for strict schema validation of chat requests and messages, ensuring runtime safety and defensive error handling.
- **Performance:** Pruning happens on the edge to minimize payload size sent to the AI model, improving response latency and reliability.

## 2025-05-15 - Hardened Chat Logic & State Safety

- **Architectural Shift:** Enforced conversational cadence by requiring chat histories to start and end with 'user' roles. This prevents malformed inference requests to the LLM.
- **State Safety:** Implemented Zod-backed hydration for chat history in `Chat.astro`. All data retrieved from `sessionStorage` is now validated against `ChatHistorySchema`, ensuring the UI is resilient against corrupted or stale local storage.
- **Stream Robustness:** Replaced manual type guards in `chat-stream.ts` with `AiResponseChunkSchema` (Zod). This provides formal validation for Server-Sent Events (SSE) payloads from Cloudflare Workers AI.
- **Test Infrastructure:** Refactored content configuration tests to support functional Astro schemas by providing a mock context. This maintains test suite health during framework transitions (Astro 6/7).
- **Utility Enhancement:** `pruneMessages` now guarantees the resulting array starts with a 'user' message, maintaining logical consistency even after history truncation.
