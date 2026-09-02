# ⚙️ Engine Journal

## 2025-05-14 - Centralized Chat Logic & Pruning

- **Architectural Shift:** Centralized chat-related constants and logic into `src/utils/chat-logic.ts` to ensure consistency between the API and potential future client-side pruning.
- **New Utility:** Established `pruneMessages` which implements a sliding window algorithm to maintain conversation history within Cloudflare Workers AI limits (10 messages, 3000 total characters).
- **TypeScript & Validation:** Leveraged Zod for strict schema validation of chat requests and messages, ensuring runtime safety and defensive error handling.
- **Performance:** Pruning happens on the edge to minimize payload size sent to the AI model, improving response latency and reliability.

## 2025-05-21 - Pointer-Based Context Pruning & Single-Pass Changelog Parsing

- **Performance & Edge Memory:** Refactored `pruneMessages` sliding-window logic in `src/utils/chat-logic.ts` to use pointer bounds slicing instead of repeated `.shift()` calls, eliminating $O(N^2)$ array re-indexing overhead during context window trimming.
- **Changelog Parsing:** Updated `parseReleaseItem` commit hash regex in `src/utils/github-releases.ts` to support 7 to 40-character hex commit SHAs. Refactored `splitReleaseBody` from a multi-stage array chain into a single-pass `for...of` loop to eliminate intermediate array allocations on Cloudflare Workers edge runtimes.

## 2025-05-28 - Pointer-Based SSE Stream Parsing & Type Hardening

- **Performance & Edge Memory:** Refactored `processBufferedText` in `src/utils/chat-stream.ts` to use iterative `indexOf('\n', startPos)` pointer traversal instead of `combined.split('\n')`. This eliminates dynamic string array allocations on incoming SSE response stream chunks in Cloudflare Workers V8 edge runtimes.
- **Type Safety & Compiler Pass Rate:** Updated Zod issue array typing in `src/utils/github-releases.ts` to `z.ZodError['issues']` to eliminate Zod 4 deprecation warnings. Added ambient declarations for Node built-ins (`process`, `node:fs`, `node:path`, `node:os`, `node:url`) and `Element.append` in `src/env.d.ts`, bringing `npm run astro check` pass rate to 0 errors across all 86 project files.
- **Testing:** Added a micro-chunk 1-byte streaming test in `src/utils/chat-stream.test.ts` to verify streaming correctness and boundary handling under pointer traversal.
