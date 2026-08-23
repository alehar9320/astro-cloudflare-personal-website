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

declare const process: {
  env: Record<string, string | undefined>;
  argv: string[];
  exit(code?: number): never;
};

declare const Buffer: {
  from(str: string): unknown;
};

declare module 'node:fs' {
  export const existsSync: (path: string) => boolean;
  export const readFileSync: (path: string, options?: unknown) => string;
  export const mkdtempSync: (prefix: string) => string;
  export const mkdirSync: (path: string, options?: unknown) => void;
  export const writeFileSync: (path: string, data: string) => void;
  export const rmSync: (path: string, options?: unknown) => void;
}

declare module 'fs' {
  export const existsSync: (path: string) => boolean;
  export const readFileSync: (path: string, options?: unknown) => string;
  export const mkdtempSync: (prefix: string) => string;
  export const mkdirSync: (path: string, options?: unknown) => void;
  export const writeFileSync: (path: string, data: string) => void;
  export const rmSync: (path: string, options?: unknown) => void;
}

declare module 'node:path' {
  export const join: (...paths: string[]) => string;
  export const dirname: (path: string) => string;
}

declare module 'node:os' {
  export const tmpdir: () => string;
}

declare module 'node:url' {
  export const fileURLToPath: (url: unknown) => string;
}

declare module 'child_process' {
  export const execSync: (command: string, options?: unknown) => unknown;
}
