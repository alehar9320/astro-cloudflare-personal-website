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

/* eslint-disable no-var */
declare var process: {
  env: Record<string, string | undefined>;
  argv: string[];
  exit(code?: number): void;
};

declare var Buffer: {
  from(data: string | Uint8Array): { toString(encoding?: string): string };
};

declare module 'node:os' {
  export function tmpdir(): string;
}

declare module 'node:url' {
  export function fileURLToPath(url: string | URL): string;
}

declare module 'node:path' {
  export function join(...paths: string[]): string;
  export function dirname(path: string): string;
}

declare module 'node:fs' {
  export function existsSync(path: string | URL): boolean;
  export function readFileSync(path: string | URL, options?: string): string;
  export function mkdtempSync(prefix: string): string;
  export function mkdirSync(path: string, options?: unknown): string | undefined;
  export function writeFileSync(path: string, data: string | Uint8Array, options?: unknown): void;
  export function rmSync(path: string, options?: unknown): void;
}

declare module 'fs' {
  export function existsSync(path: string | URL): boolean;
  export function readFileSync(path: string | URL, options?: string): string;
  export function writeFileSync(path: string, data: string): void;
}

declare module 'child_process' {
  export function execSync(cmd: string, options?: unknown): unknown;
}
