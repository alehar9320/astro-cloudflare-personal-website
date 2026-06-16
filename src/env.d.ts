/// <reference types="astro/client" />

interface Env {
  AI: {
    run: (model: string, input: unknown) => Promise<ReadableStream>;
  };
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
