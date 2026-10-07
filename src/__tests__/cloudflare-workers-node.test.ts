import { afterEach, describe, expect, it, vi } from 'vitest';

import { env } from '../env/cloudflare-workers.node';

describe('cloudflare:workers Node stub', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('reads string secrets from process.env and has no AI binding', () => {
    vi.stubEnv('POSTHOG_PERSONAL_API_KEY', 'phx_test');
    expect(env.POSTHOG_PERSONAL_API_KEY).toBe('phx_test');
    expect(env.AI).toBeUndefined();
    expect(env.CHAT_STORE).toBeUndefined();
  });

  it('returns undefined for non-string properties', () => {
    const sym = Symbol('test');
    expect((env as Record<symbol, unknown>)[sym]).toBeUndefined();
  });
});
