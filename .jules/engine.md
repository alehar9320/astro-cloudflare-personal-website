# ⚙️ Engine Journal

## 2025-05-14 - Centralized Chat Logic & Pruning

- **Architectural Shift:** Centralized chat-related constants and logic into `src/utils/chat-logic.ts` to ensure consistency between the API and potential future client-side pruning.
- **New Utility:** Established `pruneMessages` which implements a sliding window algorithm to maintain conversation history within Cloudflare Workers AI limits (10 messages, 3000 total characters).
- **TypeScript & Validation:** Leveraged Zod for strict schema validation of chat requests and messages, ensuring runtime safety and defensive error handling.
- **Performance:** Pruning happens on the edge to minimize payload size sent to the AI model, improving response latency and reliability.

## 2025-06-23 - Hardening & State Safety

- **Architectural Shift:** Introduced Zod-based validation for client-side state hydration from `sessionStorage` in `Chat.astro`. This ensures that corrupted or outdated history doesn't cause runtime errors.
- **API Robustness:** Hardened `/api/chat` by enforcing that message history must end with a 'user' message, preventing malformed requests to Cloudflare Workers AI.
- **Logic Refinement:** Updated `pruneMessages` to ensure conversation history always starts with a 'user' message, maintaining the expected conversational cadence for the LLM.
- **TypeScript Improvements:** Refined `App.Locals` in `src/env.d.ts` to natively support `runtime.env`, removing the need for unsafe type assertions in API routes.
