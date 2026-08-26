# ⚙️ Engine Journal

## 2025-05-14 - Centralized Chat Logic & Pruning

- **Architectural Shift:** Centralized chat-related constants and logic into `src/utils/chat-logic.ts` to ensure consistency between the API and potential future client-side pruning.
- **New Utility:** Established `pruneMessages` which implements a sliding window algorithm to maintain conversation history within Cloudflare Workers AI limits (10 messages, 3000 total characters).
- **TypeScript & Validation:** Leveraged Zod for strict schema validation of chat requests and messages, ensuring runtime safety and defensive error handling.
- **Performance:** Pruning happens on the edge to minimize payload size sent to the AI model, improving response latency and reliability.

## 2025-05-21 - SSE Stream Parser Optimization & CRLF Boundary Hardening

- **Architectural Shift:** Refactored stateful SSE streaming parser in `src/utils/chat-stream.ts` to handle carriage returns (`\r\n`) during line-by-line parsing rather than performing global string replacements across incoming chunks.
- **Edge-Case Constraints:** Handled CRLF line endings split across chunk boundaries when streaming response data from Cloudflare Workers AI.
- **Performance:** Bypassed array joins when processing single-line SSE event payloads (`data: ...`), reducing garbage collection pressure during live avatar streaming.
