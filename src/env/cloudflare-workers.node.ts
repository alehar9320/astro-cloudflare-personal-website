/**
 * Node stand-in for `cloudflare:workers` when RENDER=true.
 * String secrets come from process.env. Worker bindings (AI, KV) stay absent.
 */
export const env: Record<string, unknown> = new Proxy(
  {},
  {
    get(_target, prop) {
      if (typeof prop !== 'string') return undefined;
      return process.env[prop];
    },
  }
);
