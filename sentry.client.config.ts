import * as Sentry from '@sentry/astro';

// Only initialize Sentry if DSN is configured (check both unprefixed and PUBLIC_ variants)
const sentryDsn = import.meta.env.SENTRY_DSN || import.meta.env.PUBLIC_SENTRY_DSN;
if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    environment:
      import.meta.env.SENTRY_ENVIRONMENT ||
      import.meta.env.PUBLIC_SENTRY_ENVIRONMENT ||
      'production',
    release: import.meta.env.SENTRY_RELEASE || import.meta.env.PUBLIC_SENTRY_RELEASE,
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    integrations: [Sentry.replayIntegration()],
  });
}
