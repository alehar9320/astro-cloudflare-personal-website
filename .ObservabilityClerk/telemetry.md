# Telemetry Standardization Journal

| Date       | Module                          | Events Standardized                                                                                                                   |
| :--------- | :------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------ |
| 2025-05-14 | `src/utils/github-releases.ts`  | `github_releases_invalid_url`, `github_releases_request_failed`, `github_releases_validation_failed`, `github_releases_request_error` |
| 2025-05-14 | `src/components/Chat.astro`     | `chat_client_error`                                                                                                                   |
| 2025-05-14 | `src/pages/api/chat.ts`         | `chat_api_json_parse_error`, `chat_api_run_error`                                                                                     |
| 2025-05-14 | `src/utils/chat-stream.ts`      | `chat_stream_parse_error`                                                                                                             |
| 2026-07-15 | `src/utils/github-releases.ts`  | `github_releases_cache_read_error`, `github_releases_cache_write_error`                                                               |
| 2026-07-15 | `src/components/Chat.astro`     | `chat_history_load_error`, `chat_history_save_error`                                                                                  |
| 2026-07-15 | `src/pages/api/chat.ts`         | `chat_api_rate_limit_read_error`, `chat_api_rate_limit_write_error`                                                                   |
| 2026-07-15 | `src/components/MainHead.astro` | `theme_preference_read_error`, `theme_preference_write_error`                                                                         |
| 2025-05-14 | `src/__tests__/*.test.ts`       | Expanded unit tests to cover 100% of telemetry branches (including non-Error rejection cases).                                        |
