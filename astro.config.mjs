// @ts-check
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import { codecovVitePlugin } from '@codecov/vite-plugin';

import cloudflare from '@astrojs/cloudflare';
import node from '@astrojs/node';
import sentry from '@sentry/astro';

const isRender = process.env.RENDER === 'true';
const isAstroCheck = process.argv.includes('check');

// Vite inlines PUBLIC_* from process.env at build time. Cloudflare Workers
// Builds does not inject wrangler.jsonc vars into that env, which is why
// PostHog never initialized on prod (key missing → PostHog.astro no-ops).
try {
  const wranglerConfig = JSON.parse(
    readFileSync(new URL('./wrangler.jsonc', import.meta.url), 'utf8')
  );
  for (const [key, value] of Object.entries(wranglerConfig.vars ?? {})) {
    if (process.env[key] === undefined && value != null) {
      process.env[key] = String(value);
    }
  }
} catch {
  // wrangler.jsonc is optional for `astro check` / local without the file.
}

const codecovPlugin = /** @type {import('vite').PluginOption} */ (
  codecovVitePlugin({
    enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
    bundleName: 'molecular-mars',
    uploadToken: process.env.CODECOV_TOKEN,
  })
);

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
    // @ts-expect-error Codecov's Vite plugin is typed against a different Vite instance than Astro's bundled one.
    plugins: [codecovPlugin],
    resolve: isRender
      ? {
          alias: {
            'cloudflare:workers': fileURLToPath(
              new URL('./src/env/cloudflare-workers.node.ts', import.meta.url)
            ),
          },
        }
      : undefined,
  },
});
