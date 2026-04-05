import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx,astro}'],
    reporters: ['default', ['junit', { outputFile: './junit.xml' }]],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      reportsDirectory: './coverage',
      all: true,
      include: ['src/**/*'],
      exclude: [
        'src/**/*.d.ts',
        'src/**/*.{test,spec}.{ts,tsx,js,jsx,mjs,cjs,astro}',
        'src/**/__tests__/**',
        'src/**/*.astro',
        'src/content/**',
        'src/data/**',
        'src/styles/**',
      ],
    },
  },
});
