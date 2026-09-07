# ⚙️ Engine Journal

## 2025-05-14 - Centralized Chat Logic & Pruning

- **Architectural Shift:** Centralized chat-related constants and logic into `src/utils/chat-logic.ts` to ensure consistency between the API and potential future client-side pruning.
- **New Utility:** Established `pruneMessages` which implements a sliding window algorithm to maintain conversation history within Cloudflare Workers AI limits (10 messages, 3000 total characters).
- **TypeScript & Validation:** Leveraged Zod for strict schema validation of chat requests and messages, ensuring runtime safety and defensive error handling.
- **Performance:** Pruning happens on the edge to minimize payload size sent to the AI model, improving response latency and reliability.

## 2025-05-21 - Pointer-Based Context Pruning & Single-Pass Changelog Parsing

- **Performance & Edge Memory:** Refactored `pruneMessages` sliding-window logic in `src/utils/chat-logic.ts` to use pointer bounds slicing instead of repeated `.shift()` calls, eliminating $O(N^2)$ array re-indexing overhead during context window trimming.
- **Changelog Parsing:** Updated `parseReleaseItem` commit hash regex in `src/utils/github-releases.ts` to support 7 to 40-character hex commit SHAs. Refactored `splitReleaseBody` from a multi-stage array chain into a single-pass `for...of` loop to eliminate intermediate array allocations on Cloudflare Workers edge runtimes.

## 2025-05-28 - Pointer-Based Edge SSE Stream Parsing

- **Performance & Edge Memory:** Refactored `processBufferedText` in `src/utils/chat-stream.ts` to use pointer-based `indexOf('\n', startPos)` traversal instead of `combined.split('\n')`.
- **Allocation Reduction:** Eliminates dynamic string array allocations on incoming SSE response stream chunks in Cloudflare Workers V8 runtime while retaining complete handling for multi-line data lines, CRLF endings, and trailing partial lines.
- **Verification:** Added Vitest unit test cases for single-character streaming, multi-line SSE payloads across chunks, and empty pushes.

## 2025-06-04 - Zero-Allocation Chat User Message Lookup & Direct Pruning Loop

- **Allocation Reduction:** Introduced `getLastUserMessage(messages)` in `src/utils/chat-logic.ts` using a reverse `for` loop to eliminate `[...messages].reverse().find(...)` array clone and in-place reversal allocations on every chat API request in Cloudflare Workers edge runtimes.
- **Loop Optimization:** Refactored initial total content character count calculation in `pruneMessages` to use a direct indexed `for` loop instead of `reduce()`, eliminating callback closure allocations on context window evaluation.
- **Verification:** Added Vitest unit tests in `src/utils/chat-logic.test.ts` covering empty message history, history with trailing assistant messages, and multiple user messages.

## 2025-06-11 - Single-Pass Edge SSR Transforms & Allocation Reductions in Whats-New Glance

- **Allocation Reduction:** Refactored `collectItems`, `thisWeek`, and `ranked` in `src/utils/whats-new-glance.ts` to process release notes with direct loops and early exit bounds, eliminating intermediate `.map()`, `.filter().map().slice()`, and `.flatMap()` array allocations during edge SSR requests.
- **Single-Pass Transforms & Hoisted Regexes:** Refactored `sentenceCount`, `metricTokens`, and `groundedReleaseSummary` in `src/utils/release-summary.ts` and `github-releases.ts` to use single-pass loops and hoisted static regular expressions, avoiding regex re-compilation and intermediate array chaining.
- **Verification:** Verified via full Vitest test suite (`npm run test`), ESLint, Prettier, `npm run astro check`, and production build (`npm run build`).
