import astro from '@astrojs/cloudflare/entrypoints/server';

import { fetchDirectNotFound, isDirectNotFoundPath } from './direct-not-found';

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    if (isDirectNotFoundPath(new URL(request.url).pathname)) {
      return fetchDirectNotFound(request, env.ASSETS);
    }
    return astro.fetch(request, env, ctx);
  },
};
