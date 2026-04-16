import * as Sentry from '@sentry/astro';

const sentryDsn = process.env.SENTRY_DSN || process.env.PUBLIC_SENTRY_DSN;
if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    environment:
      process.env.SENTRY_ENVIRONMENT || process.env.PUBLIC_SENTRY_ENVIRONMENT || 'production',
    release: process.env.SENTRY_RELEASE || process.env.PUBLIC_SENTRY_RELEASE,
    sendDefaultPii: false,
    tracesSampleRate: 1.0,
  });
}
