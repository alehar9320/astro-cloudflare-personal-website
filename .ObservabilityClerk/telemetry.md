# Telemetry Standardization Journal

## Standardized Schema

All telemetry events MUST follow this structured format:

```typescript
{
  event: string;      // kebab_case or snake_case event identifier
  [key: string]: any; // Additional contextual metadata
}
```

## Instrumented Modules

| Date       | Module                         | Events Standardized                                                                                                                   |
| ---------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| 2025-05-15 | `src/pages/api/chat.ts`        | `chat_rate_limit_exceeded`, `chat_invalid_json_payload`, `chat_ai_execution_failed`                                                   |
| 2025-05-15 | `src/utils/github-releases.ts` | `github_releases_invalid_url`, `github_releases_request_failed`, `github_releases_validation_failed`, `github_releases_request_error` |
| 2025-05-15 | `src/lib/posthog.ts`           | `posthog_config_invalid`                                                                                                              |
| 2025-05-15 | `src/components/Chat.astro`    | `chat_client_error`                                                                                                                   |

## Validation

- [x] Log output verification (JSON objects)
- [x] Type safety check (via `npm run astro check`)
- [x] Linter evaluation (via `npm run lint`)
