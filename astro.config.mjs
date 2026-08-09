// @ts-check
import { defineConfig } from 'astro/config';
import { codecovVitePlugin } from '@codecov/vite-plugin';

import cloudflare from '@astrojs/cloudflare';
import node from '@astrojs/node';
import sentry from '@sentry/astro';

const isRender = process.env.RENDER === 'true';
const isAstroCheck = process.argv.includes('check');

const codecovPlugin = /** @type {import('vite').PluginOption} */ (
  codecovVitePlugin({
    enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
    bundleName: 'molecular-mars',
    uploadToken: process.env.CODECOV_TOKEN,
  })
);

// Under Astro v7/Vite v7, we prevent the Codecov plugin from running during SSR builds
// to avoid Rollup input conflicts.
if (codecovPlugin && typeof codecovPlugin === 'object' && !Array.isArray(codecovPlugin)) {
  // @ts-expect-error - adding custom apply behavior for SSR gating
  codecovPlugin.apply = (config, { isSsrBuild }) => !isSsrBuild;
}

// https://astro.build/config
export default defineConfig({
  output: isRender ? 'server' : 'static',
  server: isRender
    ? {
        // Render health checks require the service to listen on an external interface.
        host: true,
      }
    : undefined,
  // Switch adapters based on the environment
  adapter: isAstroCheck
    ? undefined
    : isRender
      ? node({ mode: 'standalone' })
      : cloudflare({
          inspectorPort: false,
          prerenderEnvironment: 'node',
          remoteBindings: false,
        }),
  image: {
    // Only use Cloudflare image service when NOT on Render
    service: isRender
      ? undefined
      : {
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
    plugins: [codecovPlugin],
  },
});
