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
    delete process.env.SENTRY_DSN;
    delete process.env.PUBLIC_SENTRY_DSN;
    delete process.env.SENTRY_ENVIRONMENT;
    delete process.env.PUBLIC_SENTRY_ENVIRONMENT;
    delete process.env.SENTRY_RELEASE;
    delete process.env.PUBLIC_SENTRY_RELEASE;
  });

  it('should not initialize Sentry if DSN is missing', async () => {
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

  it('should initialize Sentry if PUBLIC_SENTRY_DSN is present (fallback)', async () => {
    process.env.PUBLIC_SENTRY_DSN = 'https://public-dsn@sentry.io/456';

    await importServerConfig('t=3');

    expect(Sentry.init).toHaveBeenCalledWith(
      expect.objectContaining({
        dsn: 'https://public-dsn@sentry.io/456',
        environment: 'production', // default fallback
      })
    );
  });

  it('should favor SENTRY_DSN over PUBLIC_SENTRY_DSN', async () => {
    process.env.SENTRY_DSN = 'https://private-dsn@sentry.io/111';
    process.env.PUBLIC_SENTRY_DSN = 'https://public-dsn@sentry.io/222';

    await importServerConfig('t=4');

    expect(Sentry.init).toHaveBeenCalledWith(
      expect.objectContaining({
        dsn: 'https://private-dsn@sentry.io/111',
      })
    );
  });

  it('should favor SENTRY_ENVIRONMENT over PUBLIC_SENTRY_ENVIRONMENT', async () => {
    process.env.SENTRY_DSN = 'https://example-dsn@sentry.io/123';
    process.env.SENTRY_ENVIRONMENT = 'staging';
    process.env.PUBLIC_SENTRY_ENVIRONMENT = 'development';

    await importServerConfig('t=5');

    expect(Sentry.init).toHaveBeenCalledWith(
      expect.objectContaining({
        environment: 'staging',
      })
    );
  });

  it('should favor SENTRY_RELEASE over PUBLIC_SENTRY_RELEASE', async () => {
    process.env.SENTRY_DSN = 'https://example-dsn@sentry.io/123';
    process.env.SENTRY_RELEASE = 'v2';
    process.env.PUBLIC_SENTRY_RELEASE = 'v1';

    await importServerConfig('t=6');

    expect(Sentry.init).toHaveBeenCalledWith(
      expect.objectContaining({
        release: 'v2',
      })
    );
  });
});
