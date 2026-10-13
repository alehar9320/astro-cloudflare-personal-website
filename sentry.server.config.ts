import * as Sentry from '@sentry/astro';

// Only initialize Sentry if DSN is configured (check both unprefixed and PUBLIC_ variants)
const sentryDsn = process.env.SENTRY_DSN || process.env.PUBLIC_SENTRY_DSN;
if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    environment:
      process.env.SENTRY_ENVIRONMENT || process.env.PUBLIC_SENTRY_ENVIRONMENT || 'production',
    release: process.env.SENTRY_RELEASE || process.env.PUBLIC_SENTRY_RELEASE,
    // Sentry 11 removed sendDefaultPii; an unset dataCollection collects everything.
    // Pin the v10 (sendDefaultPii: false) baseline explicitly.
    dataCollection: {
      userInfo: false,
      cookies: false,
      httpHeaders: {
        request: { deny: ['forwarded', '-ip', 'remote-', 'via', '-user'] },
        response: { deny: ['forwarded', '-ip', 'remote-', 'via', '-user'] },
      },
      httpBodies: [],
      urlQueryParams: { deny: ['forwarded', '-ip', 'remote-', 'via', '-user'] },
      genAI: { inputs: false, outputs: false },
      databaseQueryData: false,
      graphQL: { document: false, variables: false },
    },
    tracesSampleRate: 1.0,
  });
}
