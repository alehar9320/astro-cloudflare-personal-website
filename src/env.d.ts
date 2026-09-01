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

declare namespace process {
  let env: Record<string, string | undefined>;
  let argv: string[];
  function exit(code?: number): void;
}

declare namespace Buffer {
  function from(data: string | Uint8Array, encoding?: string): Uint8Array;
}

declare module 'fs' {
  export function existsSync(path: string | URL): boolean;
  export function readFileSync(path: string | URL, encoding?: string): string;
  export function writeFileSync(path: string | URL, data: string | Uint8Array): void;
}

declare module 'node:fs' {
  export function existsSync(path: string | URL): boolean;
  export function readFileSync(path: string | URL, encoding?: string): string;
  export function writeFileSync(path: string | URL, data: string | Uint8Array): void;
  export function mkdtempSync(prefix: string): string;
  export function mkdirSync(path: string | URL, options?: { recursive?: boolean }): void;
  export function rmSync(
    path: string | URL,
    options?: { recursive?: boolean; force?: boolean }
  ): void;
}

declare module 'node:url' {
  export function fileURLToPath(url: URL | string): string;
}

declare module 'node:path' {
  const path: {
    join(...paths: string[]): string;
    resolve(...paths: string[]): string;
    dirname(p: string): string;
  };
  export default path;
}

declare module 'node:os' {
  export function tmpdir(): string;
}

declare module 'child_process' {
  export function execSync(command: string, options?: unknown): unknown;
}
