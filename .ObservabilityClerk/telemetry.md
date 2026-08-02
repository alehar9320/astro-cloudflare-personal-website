# Telemetry Standardization Journal

| Date       | Module                         | Events Standardized                                                                                                                    |
| :--------- | :----------------------------- | :------------------------------------------------------------------------------------------------------------------------------------- |
| 2025-05-14 | `src/utils/github-releases.ts` | `github_releases_invalid_url`, `github_releases_request_failed`, `github_releases_validation_failed`, `github_releases_request_error`  |
| 2025-05-14 | `src/components/Chat.astro`    | `chat_client_error`                                                                                                                    |
| 2025-05-14 | `src/pages/api/chat.ts`        | `chat_api_json_parse_error`, `chat_api_run_error`                                                                                      |
| 2025-05-14 | `src/utils/chat-stream.ts`     | `chat_stream_parse_error`                                                                                                              |
| 2025-05-14 | `src/__tests__/*.test.ts`      | Expanded unit tests to cover 100% of telemetry branches (including non-Error rejection cases).                                         |
| 2026-05-21 | `src/utils/github-releases.ts` | Uniformed `{ event, error, ...context }` schema compliance for request failure, invalid origin URL, and validation failed events.      |
| 2026-05-21 | `src/pages/api/chat.ts`        | Uniformed warning and error telemetry to strictly output `error` key with `Validation failed` message on request verification failure. |
