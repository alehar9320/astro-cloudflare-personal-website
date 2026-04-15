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

  it('should use default DSN if SENTRY_DSN is missing', async () => {
    delete process.env.SENTRY_DSN;

    await importServerConfig('t=1');

    expect(Sentry.init).toHaveBeenCalledWith(
      expect.objectContaining({
        dsn: 'https://7ecb3a9c0549d3d1818112e1bc11ad67@o4511135179669504.ingest.de.sentry.io/4511155924435024',
      })
    );
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
        sendDefaultPii: true,
        tracesSampleRate: 1.0,
      })
    );
  });
});
