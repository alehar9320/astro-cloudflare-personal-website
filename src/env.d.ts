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
    exit: (code?: number) => never;
  }
}

declare const process: NodeJS.Process;

declare class Buffer {
  static from(str: string, encoding?: string): Buffer;
  toString(encoding?: string): string;
}

declare module 'node:fs' {
  export function existsSync(path: string | Buffer | URL): boolean;
  export function readFileSync(path: string | Buffer | URL, options?: unknown): string;
  export function writeFileSync(
    path: string | Buffer | URL,
    data: unknown,
    options?: unknown
  ): void;
  export function mkdtempSync(prefix: string): string;
  export function mkdirSync(path: string, options?: unknown): void;
  export function rmSync(path: string, options?: unknown): void;
}

declare module 'fs' {
  export function existsSync(path: string | Buffer | URL): boolean;
  export function readFileSync(path: string | Buffer | URL, options?: unknown): string;
  export function writeFileSync(
    path: string | Buffer | URL,
    data: unknown,
    options?: unknown
  ): void;
  export function mkdtempSync(prefix: string): string;
  export function mkdirSync(path: string, options?: unknown): void;
  export function rmSync(path: string, options?: unknown): void;
}

declare module 'node:path' {
  export function join(...paths: string[]): string;
  export function resolve(...paths: string[]): string;
  export function dirname(path: string): string;
  export function basename(path: string, ext?: string): string;
}

declare module 'node:url' {
  export function fileURLToPath(url: string | URL): string;
}

declare module 'node:os' {
  export function tmpdir(): string;
}

declare module 'child_process' {
  export function execSync(command: string, options?: unknown): Buffer | string;
}
