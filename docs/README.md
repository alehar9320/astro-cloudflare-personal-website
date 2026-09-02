# docs/

Engineering documentation for this repo. Visitor copy lives on the live site ([https://me.alehar.workers.dev/](https://me.alehar.workers.dev/)). The [GitHub Wiki](https://github.com/alehar9320/astro-cloudflare-personal-website/wiki) is a map only; it is not a second source of truth.

## Index

| Path | Role |
| --- | --- |
| [adr/0001-cloudflare-production-render-jules.md](adr/0001-cloudflare-production-render-jules.md) | ADR: Cloudflare Workers = production; Render = Jules test env (not failover) |
| [mcp.md](mcp.md) | MCP server setup for AI agents (Cursor and siblings) |
| [zod-guidelines.md](zod-guidelines.md) | Zod schema-first / runtime validation practices |
| [inspirations.md](inspirations.md) | Reference personal sites for design and structure |

## Nearby (repo root)

| Path | Role |
| --- | --- |
| [README.md](../README.md) | Human front door: what this is, how to run, how prod deploys |
| [AGENTS.md](../AGENTS.md) | AI / agent source of truth |
| [SECURITY.md](../SECURITY.md) | Vulnerability reports via LinkedIn |
| GitHub Releases | Canonical changelog (prefer releases over root `CHANGELOG.md`) |

## Locks (do not undo in docs)

- Hire path: [LinkedIn](https://www.linkedin.com/in/alehar/) only (no public email, no mailto hire, no placeholder CV PDF).
- Production host: Cloudflare Workers only.
- GitHub Pages stays off.
