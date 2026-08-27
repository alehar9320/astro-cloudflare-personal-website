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

declare namespace NodeJS {
  interface ProcessEnv {
    [key: string]: string | undefined;
  }
}

/* eslint-disable no-var */
declare var process: {
  env: NodeJS.ProcessEnv;
  exit: (code?: number) => never;
  argv: string[];
};

interface Buffer {
  toString(encoding?: string): string;
}

declare var Buffer: {
  from(data: unknown, encoding?: string): Buffer;
};
/* eslint-enable no-var */

declare module 'fs' {
  export function existsSync(path: unknown): boolean;
  export function readFileSync(path: unknown, options?: unknown): string;
  export function writeFileSync(path: unknown, data: unknown): void;
  export function appendFileSync(path: unknown, data: unknown): void;
  export function mkdtempSync(prefix: string): string;
  export function mkdirSync(path: unknown, options?: unknown): void;
  export function rmSync(path: unknown, options?: unknown): void;
}

declare module 'node:fs' {
  export function existsSync(path: unknown): boolean;
  export function readFileSync(path: unknown, options?: unknown): string;
  export function writeFileSync(path: unknown, data: unknown): void;
  export function appendFileSync(path: unknown, data: unknown): void;
  export function mkdtempSync(prefix: string): string;
  export function mkdirSync(path: unknown, options?: unknown): void;
  export function rmSync(path: unknown, options?: unknown): void;
}

declare module 'node:url' {
  export function fileURLToPath(url: unknown): string;
}

declare module 'node:path' {
  const path: {
    join(...paths: string[]): string;
    resolve(...paths: string[]): string;
    dirname(path: string): string;
    basename(path: string, ext?: string): string;
  };
  export default path;
}

declare module 'node:os' {
  export function tmpdir(): string;
}

declare module 'child_process' {
  export function execSync(command: string, options?: unknown): Buffer | string;
}
