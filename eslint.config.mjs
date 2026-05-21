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
      'env.d.ts',
      'worker-configuration.d.ts',
    ],
  },
];
