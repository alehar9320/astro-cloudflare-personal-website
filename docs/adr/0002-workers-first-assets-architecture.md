# 0002. Unified Workers-First Assets Architecture

- **Status:** Accepted
- **Date:** 2026-03-31
- **Deciders:** Autonomous Architect (Archie) / Repository Analysis

## Context

Cloudflare deprecated legacy Cloudflare Pages functions and routing models in favor of a unified Cloudflare Workers + Assets architecture. The repository previously migrated to a single `wrangler.jsonc` configuration with an `assets` binding pointing to `./dist` and a custom worker entrypoint at `src/cloudflare-worker.ts`. This architecture provides unified worker execution, direct binding access (KV, Workers AI), and simplified asset routing control.

## Decision

All Cloudflare edge runtime logic, routing, and binding configurations MUST strictly use the unified Workers-First model (`wrangler.jsonc` + `src/cloudflare-worker.ts`). Legacy Cloudflare Pages constructs (`_routes.json`, `_headers`, or `functions/` directory) are banned.

## Consequences & Tradeoffs

- **Positive:** Centralized worker configuration in `wrangler.jsonc`, direct access to Cloudflare Workers AI and KV namespaces, and predictable asset serving via `run_worker_first`.
- **Negative / Risks:** Direct modification of `wrangler.jsonc` requires careful verification to avoid breaking production binding maps (`CHAT_STORE`, `AI`).
- **Adoption Readiness:** Already fully implemented in the codebase via `wrangler.jsonc` and `src/cloudflare-worker.ts`.

## Directives for AI Agents

- **Do:** Configure edge routing, Workers AI bindings, KV namespaces, and environment variables strictly in `wrangler.jsonc`.
- **Do:** Use `src/cloudflare-worker.ts` for custom edge middleware and request handling.
- **Don't:** Introduce legacy Cloudflare Pages configuration files (`_routes.json`, `_headers`, `_redirects`, or `functions/` directory).
- **Don't:** Modify `wrangler.jsonc` bindings without verifying impact on Cloudflare Workers edge execution.
