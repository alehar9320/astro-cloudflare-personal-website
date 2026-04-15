import * as Sentry from '@sentry/astro';

// Client-side Sentry configuration with browser-compatible environment variables
// Note: Variables must use PUBLIC_ prefix to be exposed to the browser bundle
const env =
  (globalThis as typeof globalThis & { importMetaEnv?: Record<string, string | undefined> })
    .importMetaEnv || (import.meta as { env: Record<string, string | undefined> }).env;

const sentryDsn =
  env?.SENTRY_DSN ||
  env?.PUBLIC_SENTRY_DSN ||
  'https://7ecb3a9c0549d3d1818112e1bc11ad67@o4511135179669504.ingest.de.sentry.io/4511155924435024';

if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    environment: env?.SENTRY_ENVIRONMENT || env?.PUBLIC_SENTRY_ENVIRONMENT || 'production',
    release: env?.SENTRY_RELEASE || env?.PUBLIC_SENTRY_RELEASE,
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    integrations: [Sentry.replayIntegration({ maskAllText: true, blockAllMedia: true })],
  });
}
