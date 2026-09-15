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

## 2025-06-11 - Pointer-Based Release Markdown Parsing & Allocation-Free Sentence Counting

- **Edge Memory & Performance:** Refactored `splitReleaseBody` in `src/utils/github-releases.ts` and `toVisitorReleaseBody` in `src/utils/visitor-changelog.ts` to use pointer-based line scanning (`indexOf('\n', startPos)`), eliminating dynamic `body.split('\n')` string array allocations during SSR and API execution.
- **Sentence Counting Optimization:** Refactored `sentenceCount` in `src/utils/release-summary.ts` from regex lookbehind `.split(/(?<=[.!?])\s+/)` into a single-pass character scanning loop. Added whitespace-aware sentence boundary detection to safely ignore dots inside version strings (`2026.08.15.1714`).
- **Verification:** Added Vitest unit test cases across `release-summary.test.ts`, `visitor-changelog.test.ts`, and `github-releases.test.ts` covering version numbers, CRLF line endings, multiple trailing punctuation, and whitespace handling.

## 2025-06-18 - Hoisted Static Regular Expressions in Chat Card Matching

- **Edge Memory & GC Allocation:** Hoisted static regular expression literal patterns in `src/utils/chat-explore.ts` to module scope constants (`SUPPRESS_PATTERN`, `LINKEDIN_PATTERN`, `DESIGN_SYSTEM_PATTERN`, `COPILOTS_PATTERN`, `ANALYTICS_PATTERN`, `THESIS_PATTERN`, `BIOGRAPHY_PATTERN`, `CASES_PATTERN`, `WORK_PATTERN`).
- **Performance:** Eliminates dynamic `RegExp` compilation and dynamic string allocations on every avatar chat message question query in Cloudflare Workers edge runtimes.
- **Verification:** Added unit test coverage in `src/utils/chat-explore.test.ts` for suppression logic, keyword variations, edge cases, and empty strings. All tests pass cleanly.
