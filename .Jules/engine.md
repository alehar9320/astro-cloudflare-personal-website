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

## 2025-06-04 - Single-Pass Edge Visitor Changelog Formatting

- **Performance & Edge Memory:** Refactored `toVisitorReleaseBody` in `src/utils/visitor-changelog.ts` from a multi-stage array pipeline (`.split().map().filter().map().filter()`) into a single-pass `for...of` loop over lines.
- **Allocation Reduction:** Hoisted static regular expressions (`LIST_ITEM_PREFIX`, `MULTI_SPACE`) to module scope, avoiding re-instantiation and dynamic intermediate array allocations during edge rendering of `/api/releases` and `/whats-new`.
- **Verification & Test Coverage:** Created a dedicated Vitest test suite (`src/utils/visitor-changelog.test.ts`) covering `stripChangelogChrome`, `toVisitorChangelogTitle`, `toVisitorReleaseBody`, and `toVisitorRelease` with 14 unit test cases.
