import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: [
      'src/**/*.{test,spec}.{js,ts,jsx,tsx,astro}',
      '__tests__/**/*.{test,spec}.{js,ts,jsx,tsx}',
    ],
    alias: {
      'astro:content': new URL('./src/__tests__/mocks/astro-content.ts', import.meta.url).pathname,
      'cloudflare:workers': new URL('./src/__tests__/mocks/cloudflare-workers.ts', import.meta.url)
        .pathname,
      'astro/loaders': new URL('./src/__tests__/mocks/astro-loaders.ts', import.meta.url).pathname,
      'astro/zod': new URL('./src/__tests__/mocks/astro-zod.ts', import.meta.url).pathname,
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
      exclude: [
        'src/**/*.d.ts',
        'src/content/**',
        'src/data/**',
        'src/styles/**',
        'src/components/Icon.astro',
        'src/components/Nav.astro',
        'src/components/PortfolioPreview.astro',
        'src/pages/work/\\[...slug\\].astro',
      ],
    },
  },
  plugins: [
    {
      name: 'astro-transformer',
      enforce: 'pre',
      async transform(code, id) {
        if (id.endsWith('.astro')) {
          const { transform: astroTransform } = await import('@astrojs/compiler');
          const result = await astroTransform(code, { filename: id });
          let transformedCode = result.code
            .replace(/interface Props \{[\s\S]*?\}/g, '')
            .replace(/import ".*?\.astro\?astro&type=style.*?";/g, '')
            .replace(/import \* as \$\$module\d+ from '.*?';/g, '');

          return {
            code: transformedCode,
            map: result.map,
            meta: { vite: { lang: 'ts' } }
          };
        }
      }
    }
  ]
});
