import * as Sentry from '@sentry/astro';

// Client-side Sentry configuration
// Note: Variables must use PUBLIC_ prefix to be exposed to the browser bundle
const dsn = import.meta.env.PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: import.meta.env.PUBLIC_SENTRY_ENVIRONMENT || 'production',
    release: import.meta.env.PUBLIC_SENTRY_RELEASE,
    integrations: [Sentry.replayIntegration({ maskAllText: true, blockAllMedia: true })],
    sendDefaultPii: false,
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}
