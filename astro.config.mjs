// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';

import sentry from '@sentry/astro';

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare(),
  integrations: [
    sentry({
      dsn: 'https://7ecb3a9c0549d3d1818112e1bc11ad67@o4511135179669504.ingest.de.sentry.io/4511155924435024',
      tracesSampleRate: 1.0,
      enableLogs: true,
      sendDefaultPii: true,
      sourceMapsUploadOptions: {
        org: 'alexander-m4',
        project: 'node-cloudflare-workers',
        authToken: process.env.SENTRY_AUTH_TOKEN,
      },
    }),
  ],
});
