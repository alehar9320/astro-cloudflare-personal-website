import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';

const PostHogMock = vi.fn();

vi.mock('posthog-node', () => ({
  PostHog: PostHogMock,
}));

describe('getPostHogClient', () => {
  beforeEach(() => {
    PostHogMock.mockClear();
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  it('returns null when the PostHog key is missing', async () => {
    const { getPostHogClient } = await import('./posthog');

    expect(getPostHogClient()).toBeNull();
    expect(PostHogMock).not.toHaveBeenCalled();
  });

  it('returns null and logs an error when the PostHog host is invalid', async () => {
    vi.stubEnv('PUBLIC_POSTHOG_KEY', 'test-key');
    vi.stubEnv('PUBLIC_POSTHOG_HOST', 'not-a-url');
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { getPostHogClient } = await import('./posthog');

    expect(getPostHogClient()).toBeNull();
    expect(consoleSpy).toHaveBeenCalled();
    expect(PostHogMock).not.toHaveBeenCalled();
  });

  it('creates a PostHog client with the configured env vars', async () => {
    vi.stubEnv('PUBLIC_POSTHOG_KEY', 'test-key');
    vi.stubEnv('PUBLIC_POSTHOG_HOST', 'https://eu.i.posthog.com');

    const { getPostHogClient } = await import('./posthog');

    const client = getPostHogClient();

    expect(PostHogMock).toHaveBeenCalledTimes(1);
    expect(PostHogMock).toHaveBeenCalledWith('test-key', {
      host: 'https://eu.i.posthog.com',
      flushAt: 1,
      flushInterval: 0,
    });
    expect(client).toBe((PostHogMock as Mock).mock.results[0]?.value);
  });

  it('reuses the cached PostHog client for repeated calls', async () => {
    vi.stubEnv('PUBLIC_POSTHOG_KEY', 'test-key');
    vi.stubEnv('PUBLIC_POSTHOG_HOST', 'https://eu.i.posthog.com');

    const { getPostHogClient } = await import('./posthog');

    const firstClient = getPostHogClient();
    const secondClient = getPostHogClient();

    expect(firstClient).toBe(secondClient);
    expect(PostHogMock).toHaveBeenCalledTimes(1);
  });
});
