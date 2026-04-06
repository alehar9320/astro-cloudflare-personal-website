---
name: edge-engineering
description: Expertise in the Cloudflare Workers + Assets architecture. Use when working on Cloudflare configuration (wrangler.jsonc) or any server-side logic in the worker.
---

# Edge-First Engineering

Mastery of the modern Cloudflare Workers + Assets architecture, ensuring that all code is optimized for execution on the edge.

## When to use this skill

- Modifying `wrangler.jsonc` or environment bindings.
- Developing server-side logic that runs in the Cloudflare Worker.
- Configuring data storage (D1, R2, KV).
- Ensuring parity between local development and the production `workerd` runtime.

## How to use it

1. **Prioritize Native Bindings:** Always prefer Cloudflare D1, R2, or KV over external SaaS providers to minimize latency and egress costs.
2. **Strict Architecture Enforcement:** Ensure the project follows the Workers + Assets binding model. `wrangler.jsonc` must have `assets` directory set to `./dist/client` and `main` entry to `./dist/server/entry.mjs`.
3. **Compatibility Date:** Always use `compatibility_date = "2025-05-21"` (or newer) to ensure modern features.
4. **Local Emulation:** Use `npx wrangler dev` to test changes in a local `workerd` environment before deployment.
5. **Binding Types:** After any change to bindings in `wrangler.jsonc`, immediately run `npx wrangler types` to update the global `env.d.ts`.
6. **Environment Access:** Access all secrets and bindings through `import { env } from 'cloudflare:workers'` (Astro 6+) or `Astro.locals.runtime.env` (Legacy).
