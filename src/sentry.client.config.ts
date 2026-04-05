import * as Sentry from '@sentry/astro';

// Client-side Sentry configuration with browser-compatible environment variables
// Note: Variables must use PUBLIC_ prefix to be exposed to the browser bundle
if (import.meta.env.PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.PUBLIC_SENTRY_DSN,
    environment: import.meta.env.PUBLIC_SENTRY_ENVIRONMENT || 'unknown',
    release: import.meta.env.PUBLIC_SENTRY_RELEASE,
    integrations: [new Sentry.Replay({ maskAllText: true, blockAllMedia: true })],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}
