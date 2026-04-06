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
2. **Strict Architecture Enforcement:** Ensure the project follows the Workers + Assets binding model, NOT the legacy Pages model.
3. **Local Emulation:** Use `npx wrangler dev` to test changes in a local `workerd` environment before deployment.
4. **Binding Types:** After any change to bindings in `wrangler.jsonc`, immediately run `npx wrangler types` to update the global `env.d.ts`.
