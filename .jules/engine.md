# ⚙️ Engine Journal

## 2025-05-14 - Centralized Chat Logic & Pruning

- **Architectural Shift:** Centralized chat-related constants and logic into `src/utils/chat-logic.ts` to ensure consistency between the API and potential future client-side pruning.
- **New Utility:** Established `pruneMessages` which implements a sliding window algorithm to maintain conversation history within Cloudflare Workers AI limits (10 messages, 3000 total characters).
- **TypeScript & Validation:** Leveraged Zod for strict schema validation of chat requests and messages, ensuring runtime safety and defensive error handling.
- **Performance:** Pruning happens on the edge to minimize payload size sent to the AI model, improving response latency and reliability.

## 2026-03-30 - Conventional Commit Parsing Optimization & Release API Streamlining

- **Architectural Shift:** Delegated release visitor transformation directly to `toVisitorRelease` in `/api/releases.ts`, eliminating redundant nested string-splitting and regex matches.
- **New Utility & Testing:** Created unit test suite `src/utils/visitor-changelog.test.ts` covering `stripChangelogChrome`, `toVisitorChangelogTitle`, `toVisitorReleaseBody`, and `toVisitorRelease`.
- **TypeScript & Regex Hardening:** Enhanced conventional commit regex in `stripChangelogChrome` to handle breaking change markers (`!:`, `(scope)!:`) and markdown formatting wrappers (e.g. `**feat:**`).
