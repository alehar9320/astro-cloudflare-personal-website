# ⚙️ Engine: Logic & Optimization Journal

## 2026-03-12 - Centralize Chat Logic and Fix History Deadlock

### Architectural Shifts

- **Centralized Logic**: Moved chat-related constants (`MAX_MESSAGES`, `MAX_TOTAL_CONTENT_LENGTH`) and Zod schemas from the API layer to a shared utility `src/utils/chat-logic.ts`. This allows both the client and server to use the same validation rules and logic.
- **Client-Side Resilience**: The Chat component now prunes message history before saving to `sessionStorage` and before sending to the API. This prevents a "Deadlock" state where a user's local history exceeds the API's strict limits, causing all subsequent requests to fail with a 400 error.

### Edge-Case Constraints

- **Message Pruning**: Implemented a sliding window approach for message history. If the history exceeds `MAX_MESSAGES` or `MAX_TOTAL_CONTENT_LENGTH`, the oldest messages are dropped.
- **Radix in ParseInt**: Standardized `parseInt` with radix `10` in the rate-limiting logic to ensure consistent behavior across different JS environments.

### Reusable Utilities & Schemas

- `ChatRequestSchema`: Zod schema for validating the entire chat request.
- `normalizeMessage`: Utility to handle legacy role conversion (`ai` -> `assistant`) and ensure content is trimmed and non-empty.
- `pruneMessages`: Utility to enforce message count and length constraints on an array of messages.

### Performance & Security

- **Hardened Headers**: Added `X-Content-Type-Options: nosniff` to API error responses to prevent MIME-sniffing vulnerabilities.
- **Validation**: Re-exports `ChatRequestSchema` to the API to ensure incoming data strictly adheres to expected formats.
