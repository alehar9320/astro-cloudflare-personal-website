// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';
import sentry from '@sentry/astro';
import { codecovVitePlugin } from '@codecov/vite-plugin';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  adapter: cloudflare({
    prerenderEnvironment: 'workerd',
  }),
  trailingSlash: 'never',
  image: {
    service: {
      entrypoint: 'astro/assets/services/cloudflare-binding',
    },
  },
  integrations: [
    sentry({
      dsn: process.env.SENTRY_DSN || process.env.PUBLIC_SENTRY_DSN,
      environment:
        process.env.SENTRY_ENVIRONMENT || process.env.PUBLIC_SENTRY_ENVIRONMENT || 'production',
      release: process.env.SENTRY_RELEASE || process.env.PUBLIC_SENTRY_RELEASE,
      tracesSampleRate: 1.0,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      sendDefaultPii: false,
      sourceMapsUploadOptions: {
        authToken: process.env.SENTRY_AUTH_TOKEN,
        org: 'personal-projects-1c',
        project: 'astro-cloudflare-site',
        release: process.env.SENTRY_RELEASE || process.env.PUBLIC_SENTRY_RELEASE,
        telemetry: false,
      },
    }),
  ],
  vite: {
    plugins: [
      codecovVitePlugin({
        enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
        bundleName: 'molecular-mars',
        uploadToken: process.env.CODECOV_TOKEN,
      }),
    ],
  },
});
