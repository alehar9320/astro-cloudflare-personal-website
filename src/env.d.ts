/// <reference types="astro/client" />

interface Env {
  AI: unknown;
  CHAT_STORE: KVNamespace;
}

declare namespace App {
  interface Locals {
    runtime: {
      env: Env;
      cf: import('@astrojs/cloudflare').IncomingRequestCfProperties;
      ctx: ExecutionContext;
    };
    title: string;
  }
}
