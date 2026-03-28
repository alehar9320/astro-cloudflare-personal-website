import { getViteConfig } from 'astro/config';

export default getViteConfig(
  {
    test: {
      environment: 'node',
      include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx,astro}'],
    },
  },
  { configFile: false },
);