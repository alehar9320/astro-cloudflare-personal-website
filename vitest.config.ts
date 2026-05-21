import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: [
      'src/**/*.{test,spec}.{js,ts,jsx,tsx,astro}',
      '__tests__/**/*.{test,spec}.{js,ts,jsx,tsx}',
    ],
    alias: {
      'astro:content': fileURLToPath(
        new URL('./src/__tests__/mocks/astro-content.ts', import.meta.url)
      ),
      'cloudflare:workers': fileURLToPath(
        new URL('./src/__tests__/mocks/cloudflare-workers.ts', import.meta.url)
      ),
      'astro/loaders': fileURLToPath(
        new URL('./src/__tests__/mocks/astro-loaders.ts', import.meta.url)
      ),
      'astro/zod': fileURLToPath(new URL('./src/__tests__/mocks/astro-zod.ts', import.meta.url)),
    },
    reporters: ['default', ['junit', { outputFile: './junit.xml' }]],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      reportsDirectory: './coverage',
      include: [
        'src/**/*',
        'sentry.server.config.ts',
        'sentry.client.config.ts',
        'scripts/release.js',
      ],
      exclude: ['src/**/*.d.ts', 'src/content/**', 'src/data/**', 'src/styles/**'],
    },
  },
});
