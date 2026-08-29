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
    exit(code?: number): void;
  }
}

declare const process: NodeJS.Process;

declare class Buffer {
  static from(data: unknown, encoding?: unknown): Buffer;
}

declare module 'node:fs' {
  export function existsSync(path: string | URL): boolean;
  export function readFileSync(path: string | URL, encoding?: string): string;
  export function mkdtempSync(prefix: string): string;
  export function mkdirSync(path: string, options?: unknown): void;
  export function writeFileSync(path: string, data: unknown): void;
  export function rmSync(path: string, options?: unknown): void;
}

interface Element {
  append(...nodes: (string | Node)[]): void;
}

declare module 'node:path';
declare module 'node:url';
declare module 'node:os';
declare module 'fs';
declare module 'child_process';
