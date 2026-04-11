import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as Sentry from '@sentry/astro';

// Mock Sentry
vi.mock('@sentry/astro', () => {
  return {
    init: vi.fn(),
    replayIntegration: vi.fn((opts) => opts),
  };
});

describe('sentry.client.config', () => {
  const importClientConfig = async (suffix: string) =>
    import(/* @vite-ignore */ `../../sentry.client.config?${suffix}`);

  beforeEach(() => {
    vi.clearAllMocks();
    // @ts-expect-error Mocking global environment
    delete globalThis.importMetaEnv;
  });

  it('should not initialize Sentry if DSN is missing', async () => {
    // @ts-expect-error Mocking global environment
    globalThis.importMetaEnv = {};

    await importClientConfig('t=1');

    expect(Sentry.init).not.toHaveBeenCalled();
  });

  it('should initialize Sentry if PUBLIC_SENTRY_DSN is present', async () => {
    // @ts-expect-error Mocking global environment
    globalThis.importMetaEnv = {
      PUBLIC_SENTRY_DSN: 'https://example-dsn@sentry.io/123',
      PUBLIC_SENTRY_ENVIRONMENT: 'test',
      PUBLIC_SENTRY_RELEASE: '1.0.0',
    };

    await importClientConfig('t=2');

    expect(Sentry.init).toHaveBeenCalledWith(
      expect.objectContaining({
        dsn: 'https://example-dsn@sentry.io/123',
        environment: 'test',
        release: '1.0.0',
        sendDefaultPii: false,
        tracesSampleRate: 1.0,
      })
    );
    expect(Sentry.replayIntegration).toHaveBeenCalledWith({
      maskAllText: true,
      blockAllMedia: true,
    });
  });

  it('should fall back to SENTRY_DSN and default environment', async () => {
    // @ts-expect-error Mocking global environment
    globalThis.importMetaEnv = {
      SENTRY_DSN: 'https://other-dsn@sentry.io/456',
    };

    await importClientConfig('t=3');

    expect(Sentry.init).toHaveBeenCalledWith(
      expect.objectContaining({
        dsn: 'https://other-dsn@sentry.io/456',
        environment: 'production',
      })
    );
  });
});
