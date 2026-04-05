import * as Sentry from '@sentry/astro';

Sentry.init({
  dsn: import.meta.env.SENTRY_DSN,
  environment: import.meta.env.SENTRY_ENVIRONMENT || 'production',
  release: import.meta.env.SENTRY_RELEASE,
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  integrations: [Sentry.replayIntegration()],
});
