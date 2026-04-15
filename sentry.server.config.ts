import * as Sentry from '@sentry/astro';

// Server-side Sentry configuration
const sentryDsn =
  process.env.SENTRY_DSN ||
  process.env.PUBLIC_SENTRY_DSN ||
  'https://7ecb3a9c0549d3d1818112e1bc11ad67@o4511135179669504.ingest.de.sentry.io/4511155924435024';

if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    environment:
      process.env.SENTRY_ENVIRONMENT || process.env.PUBLIC_SENTRY_ENVIRONMENT || 'production',
    release: process.env.SENTRY_RELEASE || process.env.PUBLIC_SENTRY_RELEASE,
    sendDefaultPii: true,
    tracesSampleRate: 1.0,
  });
}
