import * as Sentry from '@sentry/astro';

// Client-side Sentry configuration with browser-compatible environment variables
// Supports both direct Vite import.meta.env and globalThis fallback for test isolation
const env =
  (globalThis as typeof globalThis & { importMetaEnv?: Record<string, string | undefined> })
    .importMetaEnv || (import.meta as { env: Record<string, string | undefined> }).env;

const sentryDsn = env?.SENTRY_DSN || env?.PUBLIC_SENTRY_DSN;

if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    environment:
      import.meta.env.SENTRY_ENVIRONMENT ||
      import.meta.env.PUBLIC_SENTRY_ENVIRONMENT ||
      'production',
    release: import.meta.env.SENTRY_RELEASE || import.meta.env.PUBLIC_SENTRY_RELEASE,
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
