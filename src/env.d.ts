/* eslint-disable no-var */
/// <reference types="astro/client" />

interface ProcessEnv {
  [key: string]: string | undefined;
}

interface Process {
  env: ProcessEnv;
  argv: string[];
  exit(code?: number): void;
}

declare var process: Process;

interface Buffer {
  toString(encoding?: string): string;
}

declare var Buffer: {
  from(str: string): Buffer;
};

declare module 'fs' {
  export function appendFileSync(path: string, data: string): void;
  export function existsSync(path: string): boolean;
  export function mkdirSync(path: string, options?: unknown): void;
  export function mkdtempSync(prefix: string): string;
  export function readFileSync(path: string | URL, encoding?: string): string;
  export function rmSync(path: string, options?: unknown): void;
  export function writeFileSync(path: string, data: string): void;
}

declare module 'node:fs' {
  export function appendFileSync(path: string, data: string): void;
  export function existsSync(path: string): boolean;
  export function mkdirSync(path: string, options?: unknown): void;
  export function mkdtempSync(prefix: string): string;
  export function readFileSync(path: string | URL, encoding?: string): string;
  export function rmSync(path: string, options?: unknown): void;
  export function writeFileSync(path: string, data: string): void;
}

declare module 'node:url' {
  export function fileURLToPath(url: URL | string): string;
}

declare module 'node:path' {
  export function dirname(path: string): string;
  export function join(...paths: string[]): string;
  export function resolve(...paths: string[]): string;
}

declare module 'node:os' {
  export function tmpdir(): string;
}

declare module 'child_process' {
  export function execSync(command: string): Buffer | string;
}

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
