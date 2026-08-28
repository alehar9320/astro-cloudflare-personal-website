# ⚙️ Engine Journal

## 2025-05-21 - Conversational Turn Pruning & Authenticated Edge Data Fetching

- **Architectural Shift & Model Context Hygiene:** Enhanced `pruneMessages` in `src/utils/chat-logic.ts` to automatically strip orphan leading `assistant` turns when conversation history is trimmed due to character/message limits. Ensures Workers AI LLM context windows always start cleanly with a `user` prompt turn.
- **Edge-Case Constraint & API Rate-Limit Safeguard:** Updated `src/pages/api/release-summary.ts` to pass `GITHUB_TOKEN` worker bindings to `fetchGitHubReleases`. Prevents unauthenticated GitHub API rate limiting (60 req/hr per edge worker IP) when fetching releases for AI summary generation.
- **Performance:** Streamlined `visitorReleases` in `src/pages/api/releases.ts` to avoid redundant re-parsing of release bodies.

## 2025-05-14 - Centralized Chat Logic & Pruning

- **Architectural Shift:** Centralized chat-related constants and logic into `src/utils/chat-logic.ts` to ensure consistency between the API and potential future client-side pruning.
- **New Utility:** Established `pruneMessages` which implements a sliding window algorithm to maintain conversation history within Cloudflare Workers AI limits (10 messages, 3000 total characters).
- **TypeScript & Validation:** Leveraged Zod for strict schema validation of chat requests and messages, ensuring runtime safety and defensive error handling.
- **Performance:** Pruning happens on the edge to minimize payload size sent to the AI model, improving response latency and reliability.
