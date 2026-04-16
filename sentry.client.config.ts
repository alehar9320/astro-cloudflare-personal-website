import * as Sentry from '@sentry/astro';

// Client-side Sentry configuration with browser-compatible environment variables
// Note: We check both globalThis.importMetaEnv (for Vitest/runtime manipulation)
// and import.meta.env (for Astro standard injection).
const env =
  (globalThis as typeof globalThis & { importMetaEnv?: Record<string, string | undefined> })
    .importMetaEnv || (import.meta as { env: Record<string, string | undefined> }).env;

const dsn = env?.PUBLIC_SENTRY_DSN || env?.SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: env?.PUBLIC_SENTRY_ENVIRONMENT || env?.SENTRY_ENVIRONMENT || 'production',
    release: env?.PUBLIC_SENTRY_RELEASE || env?.SENTRY_RELEASE,
    sendDefaultPii: false,
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    integrations: [
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
  });
}
