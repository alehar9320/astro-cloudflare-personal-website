/// <reference types="astro/client" />

type Runtime = import('@astrojs/cloudflare').Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {
    title: string;
  }
}

interface Env {
  AI: {
    run: (model: string, input: unknown) => Promise<ReadableStream>;
  };
  CHAT_STORE: KVNamespace;
}

declare module '*.txt?raw' {
  const content: string;
  export default content;
}
