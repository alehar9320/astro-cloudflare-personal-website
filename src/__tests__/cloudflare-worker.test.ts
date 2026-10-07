import { describe, expect, it, vi } from 'vitest';

import worker from '../cloudflare-worker';

vi.mock('@astrojs/cloudflare/entrypoints/server', () => ({
  default: {
    fetch: vi.fn(async () => new Response('Astro response', { status: 200 })),
  },
}));

describe('cloudflare-worker handler', () => {
  it('serves direct 404 paths with fetchDirectNotFound', async () => {
    const env = {
      ASSETS: {
        fetch: vi.fn(async () => new Response('Not Found HTML', { status: 200 })),
      },
    };

    const request = new Request('https://me.alehar.workers.dev/404');
    const response = await worker.fetch(request, env as never, {} as ExecutionContext);

    expect(response.status).toBe(404);
    expect(await response.text()).toBe('Not Found HTML');
  });

  it('delegates normal routes to astro.fetch', async () => {
    const env = { ASSETS: { fetch: vi.fn() } };
    const request = new Request('https://me.alehar.workers.dev/biography');

    const response = await worker.fetch(request, env as never, {} as ExecutionContext);

    expect(response.status).toBe(200);
    expect(await response.text()).toBe('Astro response');
  });
});
