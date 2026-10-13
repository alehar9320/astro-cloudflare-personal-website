import * as Sentry from '@sentry/astro';

// Client-side Sentry configuration with browser-compatible environment variables
// Supports both direct Vite import.meta.env and globalThis fallback for test isolation
const env =
  (globalThis as typeof globalThis & { importMetaEnv?: Record<string, string | undefined> })
    .importMetaEnv || (import.meta as { env: Record<string, string | undefined> }).env;

const sentryDsn = env?.SENTRY_DSN || env?.PUBLIC_SENTRY_DSN;

if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    environment: env.SENTRY_ENVIRONMENT || env.PUBLIC_SENTRY_ENVIRONMENT || 'production',
    release: env.SENTRY_RELEASE || env.PUBLIC_SENTRY_RELEASE,
    integrations: [Sentry.replayIntegration({ maskAllText: true, blockAllMedia: true })],
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
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}
