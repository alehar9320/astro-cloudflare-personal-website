# ⚙️ Engine Journal

## 2025-05-21 - Hardened Releases API with Worker Token Support, KV Caching, and Snapshot Fallback

- **Architectural Shift:** Upgraded `/api/releases` and `fetchGitHubReleases` to support authenticated edge fetching using `GITHUB_TOKEN` from Cloudflare Worker environment bindings, bypassing unauthenticated IP rate limits on the edge.
- **Edge Resilience & Caching:** Integrated `CHAT_STORE` KV caching (1-hour TTL) into `/api/releases` and added a graceful fallback to `LATEST_RELEASE_SNAPSHOT` when GitHub API is unreachable or rate-limited.
- **TypeScript & Optimization:** Maintained strict type safety (`SiteReleaseSchema.array().safeParse`) for KV validation and streamlined release normalization into a clean, single-pass visitor copy transformation.

## 2025-05-14 - Centralized Chat Logic & Pruning

- **Architectural Shift:** Centralized chat-related constants and logic into `src/utils/chat-logic.ts` to ensure consistency between the API and potential future client-side pruning.
- **New Utility:** Established `pruneMessages` which implements a sliding window algorithm to maintain conversation history within Cloudflare Workers AI limits (10 messages, 3000 total characters).
- **TypeScript & Validation:** Leveraged Zod for strict schema validation of chat requests and messages, ensuring runtime safety and defensive error handling.
- **Performance:** Pruning happens on the edge to minimize payload size sent to the AI model, improving response latency and reliability.
