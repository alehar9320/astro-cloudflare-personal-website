2026-03-30 - Cloudflare Workers + Assets Architecture Codification
Learning: Transitioning from legacy Cloudflare Pages to the unified Workers + Assets model (`wrangler.jsonc`) requires explicit agent directives to prevent AI agents from generating outdated `_routes.json` or `_headers` files or attempting manual deployment pushes in CI.
Action: Document Workers + Assets in ADR 0002 and enforce via Tech Radar `Hold` status on legacy Pages patterns.
