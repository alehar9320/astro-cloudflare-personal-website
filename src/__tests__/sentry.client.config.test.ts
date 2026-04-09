import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as Sentry from '@sentry/astro';

// Mock Sentry
vi.mock('@sentry/astro', () => {
  return {
    init: vi.fn(),
    replayIntegration: vi.fn(() => ({})),
  };
});

describe('sentry.client.config', () => {
  const importClientConfig = async (suffix: string) =>
    import(/* @vite-ignore */ `../sentry.client.config?${suffix}`);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not initialize Sentry if PUBLIC_SENTRY_DSN is missing', async () => {
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

    expect(Sentry.init).toHaveBeenCalled();
    expect(Sentry.replayIntegration).toHaveBeenCalledWith({
      maskAllText: true,
      blockAllMedia: true,
    });
    expect(Sentry.init).toHaveBeenCalledWith(
      expect.objectContaining({
        dsn: 'https://example-dsn@sentry.io/123',
        environment: 'test',
        release: '1.0.0',
        sendDefaultPii: false,
        tracesSampleRate: 1.0,
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
      })
    );
  });

  it('should fallback to "unknown" environment if PUBLIC_SENTRY_ENVIRONMENT is missing', async () => {
    // @ts-expect-error Mocking global environment
    globalThis.importMetaEnv = {
      PUBLIC_SENTRY_DSN: 'https://example-dsn@sentry.io/123',
    };

    await importClientConfig('t=3');

    expect(Sentry.init).toHaveBeenCalledWith(
      expect.objectContaining({
        environment: 'unknown',
      })
    );
  });
});
