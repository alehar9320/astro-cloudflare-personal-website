import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as Sentry from '@sentry/astro';

// Mock Sentry
vi.mock('@sentry/astro', () => {
  return {
    init: vi.fn(),
  };
});

describe('sentry.server.config', () => {
  const originalEnv = process.env;
  const importServerConfig = async (suffix: string) =>
    import(/* @vite-ignore */ `../sentry.server.config?${suffix}`);

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
  });

  it('should not initialize Sentry if SENTRY_DSN is missing', async () => {
    delete process.env.SENTRY_DSN;

    await importServerConfig('t=1');

    expect(Sentry.init).not.toHaveBeenCalled();
  });

  it('should initialize Sentry if SENTRY_DSN is present', async () => {
    process.env.SENTRY_DSN = 'https://example-dsn@sentry.io/123';
    process.env.SENTRY_ENVIRONMENT = 'test';
    process.env.SENTRY_RELEASE = '1.0.0';

    await importServerConfig('t=2');

    expect(Sentry.init).toHaveBeenCalledWith(
      expect.objectContaining({
        dsn: 'https://example-dsn@sentry.io/123',
        environment: 'test',
        release: '1.0.0',
        sendDefaultPii: false,
        tracesSampleRate: 1.0,
      })
    );
  });

  it('should fallback to PUBLIC_SENTRY_DSN if SENTRY_DSN is missing', async () => {
    delete process.env.SENTRY_DSN;
    process.env.PUBLIC_SENTRY_DSN = 'https://public-dsn@sentry.io/456';

    await importServerConfig('t=3');

    expect(Sentry.init).toHaveBeenCalledWith(
      expect.objectContaining({
        dsn: 'https://public-dsn@sentry.io/456',
      })
    );
  });

  it('should fallback to PUBLIC_ variants for environment and release', async () => {
    process.env.SENTRY_DSN = 'https://example-dsn@sentry.io/123';
    delete process.env.SENTRY_ENVIRONMENT;
    delete process.env.SENTRY_RELEASE;
    process.env.PUBLIC_SENTRY_ENVIRONMENT = 'staging';
    process.env.PUBLIC_SENTRY_RELEASE = '2.0.0';

    await importServerConfig('t=4');

    expect(Sentry.init).toHaveBeenCalledWith(
      expect.objectContaining({
        environment: 'staging',
        release: '2.0.0',
      })
    );
  });

  it('should use production as default environment', async () => {
    process.env.SENTRY_DSN = 'https://example-dsn@sentry.io/123';
    delete process.env.SENTRY_ENVIRONMENT;
    delete process.env.PUBLIC_SENTRY_ENVIRONMENT;

    await importServerConfig('t=5');

    expect(Sentry.init).toHaveBeenCalledWith(
      expect.objectContaining({
        environment: 'production',
      })
    );
  });
});
