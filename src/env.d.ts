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

interface ParentNode {
  append(...nodes: (string | Node)[]): void;
  prepend(...nodes: (string | Node)[]): void;
}

interface Element {
  append(...nodes: (string | Node)[]): void;
  prepend(...nodes: (string | Node)[]): void;
}

declare const process: {
  env: Record<string, string | undefined>;
  argv: string[];
  exit(code?: number): void;
};

declare const Buffer: {
  from(str: string, encoding?: string): Uint8Array;
};

declare module 'fs' {
  export function existsSync(path: string): boolean;
  export function readFileSync(path: string | URL, encoding?: string): string;
  export function writeFileSync(path: string, data: string): void;
  export function mkdirSync(path: string, options?: unknown): void;
  export function mkdtempSync(prefix: string): string;
  export function rmSync(path: string, options?: unknown): void;
}

declare module 'node:fs' {
  export function existsSync(path: string): boolean;
  export function readFileSync(path: string | URL, encoding?: string): string;
  export function writeFileSync(path: string, data: string): void;
  export function mkdirSync(path: string, options?: unknown): void;
  export function mkdtempSync(prefix: string): string;
  export function rmSync(path: string, options?: unknown): void;
}

declare module 'node:url' {
  export function fileURLToPath(url: string | URL): string;
}

declare module 'node:path' {
  export function join(...paths: string[]): string;
  export function resolve(...paths: string[]): string;
  export function dirname(path: string): string;
}

declare module 'node:os' {
  export function tmpdir(): string;
}

declare module 'child_process' {
  export function execSync(command: string, options?: unknown): Uint8Array;
}
