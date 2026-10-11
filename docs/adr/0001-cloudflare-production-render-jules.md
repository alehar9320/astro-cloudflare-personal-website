# ADR 0001: Cloudflare as production, Render as Jules test env

- Status: Accepted
- Date: 2026-08-24

## Context

The site can build two ways: Cloudflare Workers (static + `@astrojs/cloudflare`) or a Node standalone server when `RENDER=true` (`@astrojs/node`). Prod already runs at https://me.alehar.workers.dev/. We need a clear split so Google Jules can debug against a Node environment without treating that path as a second production or failover.

## Decision

Production is Cloudflare Workers only. Render is a test environment for Google Jules (Node server via `render.yaml`). It is not a second prod and not a failover.

## Consequences

- Ship and operate prod on the Cloudflare Worker (`wrangler.jsonc`, `src/cloudflare-worker.ts`).
- Keep the Render Node path for Jules debugging only; expect AI/KV and other Workers bindings to be absent or stubbed there (`src/env/cloudflare-workers.node.ts`).
- Docs and ops language should call Cloudflare production and Render the Jules test env.
