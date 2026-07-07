export interface EdgeContext {
  AI?: {
    run: (model: string, input: unknown) => Promise<ReadableStream>;
  };
  CHAT_STORE?: KVNamespace;
}

/**
 * Safely extracts Cloudflare bindings and environment variables from Astro locals.
 * Provides a fallback to process.env for local development compatibility.
 *
 * @param locals - The Astro.locals object from the current request context.
 * @returns An object containing the available edge bindings.
 */
export function getEdgeContext(locals: App.Locals): EdgeContext {
  const runtime = (locals as unknown as { runtime?: { env: EdgeContext } }).runtime;

  if (runtime?.env) {
    return runtime.env;
  }

  // Fallback for local development or non-Cloudflare environments
  return (typeof process !== 'undefined' ? process.env : {}) as unknown as EdgeContext;
}

/**
 * Extracts the client's IP address from the request headers.
 * Prioritizes Cloudflare's specific header for accuracy on the edge.
 *
 * @param request - The incoming Web API Request object.
 * @returns The detected IP address or 'anonymous' if none is found.
 */
export function getClientIp(request: Request): string {
  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp) return cfIp;

  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  return 'anonymous';
}
