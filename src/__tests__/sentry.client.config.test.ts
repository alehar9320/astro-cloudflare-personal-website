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
    import(/* @vite-ignore */ `../../sentry.client.config?${suffix}`);

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset global environment before each test
    // @ts-expect-error Mocking global environment
    globalThis.importMetaEnv = undefined;
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
        integrations: [expect.anything()],
      })
    );
  });

  it('should initialize Sentry if SENTRY_DSN is present (unprefixed fallback)', async () => {
    // @ts-expect-error Mocking global environment
    globalThis.importMetaEnv = {
      SENTRY_DSN: 'https://unprefixed-dsn@sentry.io/456',
    };

    await importClientConfig('t=3');

    expect(Sentry.init).toHaveBeenCalledWith(
      expect.objectContaining({
        dsn: 'https://unprefixed-dsn@sentry.io/456',
        environment: 'production', // default fallback
      })
    );
  });

  it('should favor PUBLIC_SENTRY_DSN over SENTRY_DSN', async () => {
    // @ts-expect-error Mocking global environment
    globalThis.importMetaEnv = {
      PUBLIC_SENTRY_DSN: 'https://public-dsn@sentry.io/123',
      SENTRY_DSN: 'https://private-dsn@sentry.io/456',
    };

    await importClientConfig('t=4');

    expect(Sentry.init).toHaveBeenCalledWith(
      expect.objectContaining({
        dsn: 'https://public-dsn@sentry.io/123',
      })
    );
  });

  it('should fallback to production environment if not specified', async () => {
    // @ts-expect-error Mocking global environment
    globalThis.importMetaEnv = {
      PUBLIC_SENTRY_DSN: 'https://example-dsn@sentry.io/123',
    };

    await importClientConfig('t=5');

    expect(Sentry.init).toHaveBeenCalledWith(
      expect.objectContaining({
        environment: 'production',
      })
    );
  });

  it('should fallback to import.meta.env if globalThis.importMetaEnv is missing', async () => {
    // globalThis.importMetaEnv is undefined by default in beforeEach
    await importClientConfig('t=6');

    // Just exercising the branch in sentry.client.config.ts:
    // .importMetaEnv || (import.meta as any).env
    expect(Sentry.init).not.toHaveBeenCalled();
  });
});
