/// <reference types="astro/client" />
/// <reference types="node" />

type Runtime = import('@astrojs/cloudflare').Runtime<Env>;

interface Element {
  append(...nodes: (string | Node)[]): void;
  prepend(...nodes: (string | Node)[]): void;
}

interface ParentNode {
  append(...nodes: (string | Node)[]): void;
  prepend(...nodes: (string | Node)[]): void;
}

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
  GITHUB_TOKEN?: string;
}

declare module '*.txt?raw' {
  const content: string;
  export default content;
}
