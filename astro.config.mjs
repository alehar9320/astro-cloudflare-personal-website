// @ts-check
import { defineConfig } from 'astro/config';
import { codecovVitePlugin } from '@codecov/vite-plugin';

import cloudflare from '@astrojs/cloudflare';
import sentry from '@sentry/astro';

const isAstroCheck = process.argv.includes('check');
const codecovPlugin = /** @type {import('vite').PluginOption} */ (
  codecovVitePlugin({
    enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
    bundleName: 'molecular-mars',
    uploadToken: process.env.CODECOV_TOKEN,
  })
);

// https://astro.build/config
export default defineConfig({
  output: 'static',
  adapter: isAstroCheck ? undefined : cloudflare({
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
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: 'personal-projects-1c',
      project: 'astro-cloudflare-site',
      telemetry: false,
    }),
  ],
  vite: {
    // @ts-expect-error Codecov's Vite plugin is typed against a different Vite instance than Astro's bundled one.
    plugins: [codecovPlugin],
  },
});
