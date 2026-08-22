# ⚙️ Engine Journal

## 2025-05-21 - Resilient KV Rate Limiting & Non-Mutating Message Windowing

- **Architectural Shift:** Wrapped Cloudflare KV rate-limit counter `store.put` operations in `src/pages/api/chat.ts` inside a defensive `try/catch` block with structured `chat_api_kv_write_error` telemetry logging.
- **Edge Resilience:** Transient KV storage write errors no longer trigger a 500 status response, allowing active AI text streams to return successfully to the client.
- **TypeScript Optimization:** Refactored `pruneMessages` in `src/utils/chat-logic.ts` to use non-mutating index window slicing (`startIndex`), eliminating array shifting ($O(N)$ re-indexing) and non-null assertions while preserving exact pruning constraints.

## 2025-05-14 - Centralized Chat Logic & Pruning

- **Architectural Shift:** Centralized chat-related constants and logic into `src/utils/chat-logic.ts` to ensure consistency between the API and potential future client-side pruning.
- **New Utility:** Established `pruneMessages` which implements a sliding window algorithm to maintain conversation history within Cloudflare Workers AI limits (10 messages, 3000 total characters).
- **TypeScript & Validation:** Leveraged Zod for strict schema validation of chat requests and messages, ensuring runtime safety and defensive error handling.
- **Performance:** Pruning happens on the edge to minimize payload size sent to the AI model, improving response latency and reliability.
