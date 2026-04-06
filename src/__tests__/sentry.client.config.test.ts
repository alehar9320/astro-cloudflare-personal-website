import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as Sentry from '@sentry/astro';

// Mock Sentry
vi.mock('@sentry/astro', () => {
  return {
    init: vi.fn(),
    Replay: vi.fn().mockImplementation(function() {
      return {};
    }),
  };
});

describe('sentry.client.config', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not initialize Sentry if PUBLIC_SENTRY_DSN is missing', async () => {
    // @ts-ignore
    globalThis.importMetaEnv = {};

    // @ts-ignore
    await import('../sentry.client.config?t=1');

    expect(Sentry.init).not.toHaveBeenCalled();
  });

  it('should initialize Sentry if PUBLIC_SENTRY_DSN is present', async () => {
    // @ts-ignore
    globalThis.importMetaEnv = {
      PUBLIC_SENTRY_DSN: 'https://example-dsn@sentry.io/123',
      PUBLIC_SENTRY_ENVIRONMENT: 'test',
      PUBLIC_SENTRY_RELEASE: '1.0.0',
    };

    // @ts-ignore
    await import('../sentry.client.config?t=2');

    expect(Sentry.init).toHaveBeenCalled();
    expect(Sentry.init).toHaveBeenCalledWith(expect.objectContaining({
      dsn: 'https://example-dsn@sentry.io/123',
      environment: 'test',
      release: '1.0.0',
    }));
  });
});
