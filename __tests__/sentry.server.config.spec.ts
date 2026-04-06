import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as Sentry from '@sentry/astro';

// Mock Sentry
vi.mock('@sentry/astro', () => {
  return {
    init: vi.fn(),
    replayIntegration: vi.fn(),
  };
});

describe('sentry.server.config', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
  });

  it('should not initialize Sentry if SENTRY_DSN is missing', async () => {
    delete process.env.SENTRY_DSN;

    await import('../sentry.server.config?t=1');

    expect(Sentry.init).not.toHaveBeenCalled();
  });

  it('should initialize Sentry if SENTRY_DSN is present', async () => {
    process.env.SENTRY_DSN = 'https://example-dsn@sentry.io/123';
    process.env.SENTRY_ENVIRONMENT = 'test';
    process.env.SENTRY_RELEASE = '1.0.0';

    await import('../sentry.server.config?t=2');

    expect(Sentry.init).toHaveBeenCalledWith(expect.objectContaining({
      dsn: 'https://example-dsn@sentry.io/123',
      environment: 'test',
      release: '1.0.0',
    }));
  });
});
