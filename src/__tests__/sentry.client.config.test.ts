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
  });

  it('should use default DSN if PUBLIC_SENTRY_DSN is missing', async () => {
    // @ts-expect-error Mocking global environment
    globalThis.importMetaEnv = {};

    await importClientConfig('t=1');

    expect(Sentry.init).toHaveBeenCalledWith(
      expect.objectContaining({
        dsn: 'https://7ecb3a9c0549d3d1818112e1bc11ad67@o4511135179669504.ingest.de.sentry.io/4511155924435024',
      })
    );
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
        tracesSampleRate: 1.0,
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
      })
    );
  });
});
