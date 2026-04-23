import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as Sentry from '@sentry/astro';

type GlobalWithEnv = typeof globalThis & {
  importMetaEnv?: Record<string, string | undefined>;
};

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
    // Reset global environment
    (globalThis as GlobalWithEnv).importMetaEnv = undefined;
  });

  it('should not initialize Sentry if DSN is missing', async () => {
    (globalThis as GlobalWithEnv).importMetaEnv = {};

    await importClientConfig('t=1');

    expect(Sentry.init).not.toHaveBeenCalled();
  });

  it('should initialize Sentry if PUBLIC_SENTRY_DSN is present', async () => {
    (globalThis as GlobalWithEnv).importMetaEnv = {
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
      })
    );
  });

  it('should initialize Sentry if SENTRY_DSN (unprefixed) is present', async () => {
    (globalThis as GlobalWithEnv).importMetaEnv = {
      SENTRY_DSN: 'https://unprefixed-dsn@sentry.io/456',
    };

    await importClientConfig('t=3');

    expect(Sentry.init).toHaveBeenCalledWith(
      expect.objectContaining({
        dsn: 'https://unprefixed-dsn@sentry.io/456',
      })
    );
  });

  it('should fallback to production environment if not provided', async () => {
    (globalThis as GlobalWithEnv).importMetaEnv = {
      PUBLIC_SENTRY_DSN: 'https://example-dsn@sentry.io/123',
    };

    await importClientConfig('t=4');

    expect(Sentry.init).toHaveBeenCalledWith(
      expect.objectContaining({
        environment: 'production',
      })
    );
  });

  it('should use SENTRY_ENVIRONMENT if PUBLIC_SENTRY_ENVIRONMENT is missing', async () => {
    (globalThis as GlobalWithEnv).importMetaEnv = {
      PUBLIC_SENTRY_DSN: 'https://example-dsn@sentry.io/123',
      SENTRY_ENVIRONMENT: 'staging',
    };

    await importClientConfig('t=5');

    expect(Sentry.init).toHaveBeenCalledWith(
      expect.objectContaining({
        environment: 'staging',
      })
    );
  });

  it('should use SENTRY_RELEASE if PUBLIC_SENTRY_RELEASE is missing', async () => {
    (globalThis as GlobalWithEnv).importMetaEnv = {
      PUBLIC_SENTRY_DSN: 'https://example-dsn@sentry.io/123',
      SENTRY_RELEASE: '2.0.0',
    };

    await importClientConfig('t=6');

    expect(Sentry.init).toHaveBeenCalledWith(
      expect.objectContaining({
        release: '2.0.0',
      })
    );
  });

  it('should fallback to import.meta.env if globalThis.importMetaEnv is missing', async () => {
    (globalThis as GlobalWithEnv).importMetaEnv = undefined;

    await importClientConfig('t=7');
  });
});
