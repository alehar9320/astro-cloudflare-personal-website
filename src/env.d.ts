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
  GITHUB_TOKEN?: string;
}

declare module '*.txt?raw' {
  const content: string;
  export default content;
}

interface Element {
  append(...nodes: (string | Node)[]): void;
  prepend(...nodes: (string | Node)[]): void;
}

declare namespace NodeJS {
  interface ProcessEnv {
    [key: string]: string | undefined;
  }
}

/* eslint-disable no-var */
declare var process: {
  env: NodeJS.ProcessEnv;
  argv: string[];
  exit(code?: number): never;
};
/* eslint-enable no-var */

/* eslint-disable no-var */
declare var Buffer: {
  from(str: string): unknown;
};
/* eslint-enable no-var */

declare module 'node:fs';
declare module 'node:url';
declare module 'node:path';
declare module 'node:os';
declare module 'fs';
declare module 'child_process';

interface ParentNode {
  append(...nodes: (string | Node)[]): void;
  prepend(...nodes: (string | Node)[]): void;
}
