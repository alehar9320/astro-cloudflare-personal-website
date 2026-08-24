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

declare interface Buffer {
  toString(encoding?: string): string;
}

declare const Buffer: {
  from(data: string): Buffer;
};

declare module 'fs' {
  export function existsSync(path: string | URL): boolean;
  export function readFileSync(path: string | URL, encoding?: string): string;
  export function writeFileSync(path: string | URL, data: string): void;
  export function mkdtempSync(prefix: string): string;
  export function mkdirSync(path: string, options?: { recursive?: boolean }): void;
  export function rmSync(path: string, options?: { recursive?: boolean; force?: boolean }): void;
}

declare module 'node:fs' {
  export function existsSync(path: string | URL): boolean;
  export function readFileSync(path: string | URL, encoding?: string): string;
  export function writeFileSync(path: string | URL, data: string): void;
  export function mkdtempSync(prefix: string): string;
  export function mkdirSync(path: string, options?: { recursive?: boolean }): void;
  export function rmSync(path: string, options?: { recursive?: boolean; force?: boolean }): void;
}

declare module 'node:url' {
  export function fileURLToPath(url: URL | string): string;
}

declare module 'node:path' {
  export function join(...paths: string[]): string;
  export function resolve(...paths: string[]): string;
}

declare module 'node:os' {
  export function tmpdir(): string;
}

declare module 'child_process' {
  export function execSync(command: string): Buffer;
}

declare namespace NodeJS {
  interface ProcessEnv {
    [key: string]: string | undefined;
  }
}

declare const process: {
  argv: string[];
  env: NodeJS.ProcessEnv;
  exit(code?: number): never;
};
