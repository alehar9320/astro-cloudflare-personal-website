import * as Sentry from '@sentry/astro';

// Only initialize Sentry if DSN is configured (check both unprefixed and PUBLIC_ variants)
const sentryDsn = process.env.SENTRY_DSN || process.env.PUBLIC_SENTRY_DSN;
if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    environment:
      process.env.SENTRY_ENVIRONMENT || process.env.PUBLIC_SENTRY_ENVIRONMENT || 'production',
    release: process.env.SENTRY_RELEASE || process.env.PUBLIC_SENTRY_RELEASE,
    tracesSampleRate: 1.0,
  });
}
