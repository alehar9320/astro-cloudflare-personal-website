import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const readme = readFileSync(path.join(process.cwd(), 'README.md'), 'utf8');

describe('README stack badges',
  () => {
    it('names live Sentry PostHog Dependabot Jules Render-test and Grok Bot with Workers not Pages',
      () => {
        expect(readme).toContain(
          '[![Deployed on Cloudflare](https://img.shields.io/badge/Cloudflare-F38020?style=flat&logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)'
        );
        expect(readme).toContain(
          '[![Sentry](https://img.shields.io/badge/Sentry-362D59?style=flat&logo=sentry&logoColor=white)](https://sentry.io/)'
        );
        expect(readme).toContain(
          '[![PostHog](https://img.shields.io/badge/PostHog-1D4AFF?style=flat&logo=posthog&logoColor=white)](https://posthog.com/)'
        );
        expect(readme).toContain(
          '[![Dependabot](https://img.shields.io/badge/Dependabot-025E8C?style=flat&logo=dependabot&logoColor=white)](https://github.com/dependabot)'
        );
        expect(readme).toContain(
          '[![Google Jules](https://img.shields.io/badge/Google_Jules-4285F4?style=flat&logo=google&logoColor=white)](https://jules.google.com)'
        );
        expect(readme).toContain(
          '[![Jules test on Render](https://img.shields.io/badge/Render-Jules_test-46E3B7?style=flat&logo=render&logoColor=white)](https://render.com/)'
        );
        expect(readme).toContain(
          '[![Grok Bot](https://img.shields.io/badge/Grok_Bot-000000?style=flat)](https://grok.com/)'
        );
      }
    );

    it('does not badge TestSprite Claude or OpenCode as live stack',
      () => {
        expect(readme).not.toMatch(/TestSprite/i);
        expect(readme).not.toMatch(/OpenCode/i);
        expect(readme).not.toContain('logo=anthropic');
        expect(readme).not.toContain('https://claude.ai');
        expect(readme).not.toContain('https://www.anthropic.com');
      }
    );

    it('does not treat Render as production or point Cloudflare at Pages',
      () => {
        expect(readme).not.toContain('https://pages.cloudflare.com/');
        expect(readme).toContain('Render-Jules_test');
      }
    );
  }
);
