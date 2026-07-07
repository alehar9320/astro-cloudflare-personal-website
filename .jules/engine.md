# ⚙️ Engine Journal

## 2025-05-14 - Centralized Chat Logic & Pruning

- **Architectural Shift:** Centralized chat-related constants and logic into `src/utils/chat-logic.ts` to ensure consistency between the API and potential future client-side pruning.
- **New Utility:** Established `pruneMessages` which implements a sliding window algorithm to maintain conversation history within Cloudflare Workers AI limits (10 messages, 3000 total characters).
- **TypeScript & Validation:** Leveraged Zod for strict schema validation of chat requests and messages, ensuring runtime safety and defensive error handling.
- **Performance:** Pruning happens on the edge to minimize payload size sent to the AI model, improving response latency and reliability.

## 2025-05-21 - Standardized Edge Context & IP Handling

- **Architectural Shift:** Established `src/utils/edge-helpers.ts` as the standard for interacting with the Cloudflare edge environment. This decouples the API logic from the specific structure of `locals` and provides a consistent interface for both production and local development.
- **Newly Established TypeScript Utilities:**
  - `getEdgeContext(locals)`: A type-safe way to extract AI and KV bindings with automatic fallback to `process.env`.
  - `getClientIp(request)`: A robust utility for IP detection that prioritizes Cloudflare-specific headers but handles common fallbacks.
- **Hardened Chat API:** Refactored the `/api/chat` route to use these new helpers, resulting in cleaner, more maintainable code with improved type safety and reduced duplication.
- **Test Coverage:** Achieved 100% test coverage for the new edge utilities and ensured the chat API remains fully verified.
