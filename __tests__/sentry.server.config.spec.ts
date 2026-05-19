import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as Sentry from '@sentry/astro';

// Mock Sentry
vi.mock('@sentry/astro', () => {
  return {
    init: vi.fn(),
  };
});

describe('sentry.server.config', () => {
  const importServerConfig = async (suffix: string) =>
    import(/* @vite-ignore */ `../sentry.server.config?${suffix}`);

  beforeEach(() => {
    vi.clearAllMocks();
    // @ts-expect-error Mocking global environment
    globalThis.importMetaEnv = undefined;
  });

  it('should not initialize Sentry if SENTRY_DSN is missing', async () => {
    // @ts-expect-error Mocking global environment
    globalThis.importMetaEnv = {};

    await importServerConfig('t=1');

    expect(Sentry.init).not.toHaveBeenCalled();
  });

  it('should initialize Sentry if SENTRY_DSN is present', async () => {
    // @ts-expect-error Mocking global environment
    globalThis.importMetaEnv = {
      SENTRY_DSN: 'https://example-dsn@sentry.io/123',
      SENTRY_ENVIRONMENT: 'test',
      SENTRY_RELEASE: '1.0.0',
    };

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

  it('should initialize Sentry using PUBLIC_ prefixes if standard variables are missing', async () => {
    // @ts-expect-error Mocking global environment
    globalThis.importMetaEnv = {
      PUBLIC_SENTRY_DSN: 'https://public-dsn@sentry.io/456',
      PUBLIC_SENTRY_ENVIRONMENT: 'staging',
      PUBLIC_SENTRY_RELEASE: '2.0.0',
    };

    await importServerConfig('t=3');

    expect(Sentry.init).toHaveBeenCalledWith(
      expect.objectContaining({
        dsn: 'https://public-dsn@sentry.io/456',
        environment: 'staging',
        release: '2.0.0',
      })
    );
  });

  it('should fallback to "production" environment if no environment is provided', async () => {
    // @ts-expect-error Mocking global environment
    globalThis.importMetaEnv = {
      SENTRY_DSN: 'https://example-dsn@sentry.io/123',
    };

    await importServerConfig('t=4');

    expect(Sentry.init).toHaveBeenCalledWith(
      expect.objectContaining({
        environment: 'production',
      })
    );
  });
});
