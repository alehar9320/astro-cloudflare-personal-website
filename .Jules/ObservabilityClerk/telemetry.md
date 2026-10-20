# Telemetry Standardization Journal

## HARD ABORT — no duplicate filing (owner lock 2026-10-20)

Read this before scouting. It overrides any idea below.

- Before you start, search this journal for an entry about the same idea, component, file or feature flag dated in the last 30 days.
- Also check for an existing branch or open PR for it: `git ls-remote --heads origin` and the open PR list.
- If either exists, stop and exit the cycle without opening a PR. Do not restack, re-file, re-date, rename or downscope it into a sibling pass.

---

| Date       | Module                         | Events Standardized                                                                                                                   |
| :--------- | :----------------------------- | :------------------------------------------------------------------------------------------------------------------------------------ |
| 2025-05-14 | `src/utils/github-releases.ts` | `github_releases_invalid_url`, `github_releases_request_failed`, `github_releases_validation_failed`, `github_releases_request_error` |
| 2025-05-14 | `src/components/Chat.astro`    | `chat_client_error`                                                                                                                   |
| 2025-05-14 | `src/pages/api/chat.ts`        | `chat_api_json_parse_error`, `chat_api_run_error`                                                                                     |
| 2025-05-14 | `src/utils/chat-stream.ts`     | `chat_stream_parse_error`                                                                                                             |
| 2025-05-14 | `src/__tests__/*.test.ts`      | Expanded unit tests to cover 100% of telemetry branches (including non-Error rejection cases).                                        |
