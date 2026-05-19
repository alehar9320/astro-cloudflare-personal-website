import * as Sentry from '@sentry/astro';

// Supports both direct Vite import.meta.env and globalThis fallback for test isolation
const env =
  (globalThis as typeof globalThis & { importMetaEnv?: Record<string, string | undefined> })
    .importMetaEnv || (import.meta as { env: Record<string, string | undefined> }).env;

// Only initialize Sentry if DSN is configured (check both unprefixed and PUBLIC_ variants)
const sentryDsn = env.SENTRY_DSN || env.PUBLIC_SENTRY_DSN;
if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    environment: env.SENTRY_ENVIRONMENT || env.PUBLIC_SENTRY_ENVIRONMENT || 'production',
    release: env.SENTRY_RELEASE || env.PUBLIC_SENTRY_RELEASE,
    sendDefaultPii: false,
    tracesSampleRate: 1.0,
  });
}
