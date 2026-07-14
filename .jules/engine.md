# ⚙️ Engine Journal

## 2025-05-14 - Centralized Chat Logic & Pruning

- **Architectural Shift:** Centralized chat-related constants and logic into `src/utils/chat-logic.ts` to ensure consistency between the API and potential future client-side pruning.
- **New Utility:** Established `pruneMessages` which implements a sliding window algorithm to maintain conversation history within Cloudflare Workers AI limits (10 messages, 3000 total characters).
- **TypeScript & Validation:** Leveraged Zod for strict schema validation of chat requests and messages, ensuring runtime safety and defensive error handling.
- **Performance:** Pruning happens on the edge to minimize payload size sent to the AI model, improving response latency and reliability.

## 2025-05-21 - Logic Hardening & Test Verification

- **Architectural Shift:** Centralized chat-related constants (`CHAT_MODEL`, `SYSTEM_PROMPT`) in `src/utils/chat-logic.ts` to improve maintainability and ensure configuration consistency across API routes.
- **Optimization:** Enhanced `pruneMessages` to ensure conversation history always starts with a 'user' message (if multiple messages exist). This provides better context grounding for the LLM and prevents hallucinations triggered by leading assistant messages.
- **Technical Standard (Verification):** Resolved `astro check` diagnostics in the test suite by implementing mock context injection for functional content schemas. This aligns the codebase with repository technical standards for type-safe content validation testing.
- **Hardening:** Added explicit type validation (`Array.isArray`) to the GitHub releases caching layer to prevent runtime errors from malformed `sessionStorage` data.
