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
  interface Process {
    env: ProcessEnv;
    argv: string[];
    exit(code?: number): never;
  }
}

declare const process: NodeJS.Process;

declare module 'node:url' {
  export function fileURLToPath(url: string | URL): string;
}

declare module 'node:path' {
  export function join(...paths: string[]): string;
  export function resolve(...paths: string[]): string;
  export function dirname(path: string): string;
  const path: {
    join(...paths: string[]): string;
    resolve(...paths: string[]): string;
    dirname(path: string): string;
  };
  export default path;
}

declare module 'node:os' {
  export function tmpdir(): string;
}

declare module 'node:fs' {
  export function existsSync(path: string | unknown): boolean;
  export function readFileSync(path: string | unknown, options?: unknown): string;
  export function writeFileSync(path: string | unknown, data: unknown, options?: unknown): void;
  export function mkdirSync(path: string | unknown, options?: unknown): void;
  export function mkdtempSync(prefix: string, options?: unknown): string;
  export function rmSync(path: string | unknown, options?: unknown): void;
}

declare module 'fs' {
  export function existsSync(path: string | unknown): boolean;
  export function readFileSync(path: string | unknown, options?: unknown): string;
  export function writeFileSync(path: string | unknown, data: unknown, options?: unknown): void;
  export function mkdirSync(path: string | unknown, options?: unknown): void;
  export function mkdtempSync(prefix: string, options?: unknown): string;
  export function rmSync(path: string | unknown, options?: unknown): void;
}

declare module 'child_process' {
  export function execSync(
    command: string,
    options?: unknown
  ): { toString(encoding?: string): string };
}

declare const Buffer: {
  from(
    data: string | Uint8Array | ArrayBuffer,
    encoding?: string
  ): { toString(encoding?: string): string };
};

interface Element {
  append(...nodes: (string | Node)[]): void;
  prepend(...nodes: (string | Node)[]): void;
}

interface ParentNode {
  append(...nodes: (string | Node)[]): void;
  prepend(...nodes: (string | Node)[]): void;
}
