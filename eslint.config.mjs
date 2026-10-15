import eslintPluginAstro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';

export default [
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  {
    ignores: [
      '**/dist/',
      '**/.astro/',
      'coverage/**/*',
      '**/node_modules/',
      '.nx/**',
      '.agents/**',
      '.pi/**',
      '.opencode/plugins/**',
      'env.d.ts',
      'worker-configuration.d.ts',
    ],
  },
];
