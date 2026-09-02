# Model Context Protocol (MCP)

Engineering SoT for which MCP servers this repo expects. Visitor copy does not live here.

## Exec summary

| Item | Fact |
| --- | --- |
| Repo config SoT | [`mcp_config.json.example`](../mcp_config.json.example) (copy patterns into your editor; do not commit real keys) |
| Tracked local file | `mcp_config.json` (gitignored secrets belong in your editor or env, not in git) |
| Servers in scope | `astro-docs`, `render`, `context7` — do **not** add new `mcpServers` without an explicit ask |
| Production | Cloudflare Workers ([ADR 0001](adr/0001-cloudflare-production-render-jules.md)) |
| Render | Jules **test** env only — not prod, not failover |

Hire path stays [LinkedIn](https://www.linkedin.com/in/alehar/) only. Overlay frost lock `69ca717`. GitHub Pages stays off.

## Server map

| Server | Purpose | Notes |
| --- | --- | --- |
| `astro-docs` | Latest Astro docs for agents | Public URL, no key |
| `context7` | Version-specific library docs / examples | Needs a Context7 API key in headers |
| `render` | Manage / debug the **Jules Render test** service | Needs a Render API key. Never treat Render as production |

Canonical example (matches `mcp_config.json.example`):

```json
{
  "mcpServers": {
    "astro-docs": {
      "url": "https://mcp.docs.astro.build/mcp"
    },
    "render": {
      "url": "https://mcp.render.com/mcp",
      "headers": {
        "Authorization": "Bearer your-render-api-key"
      }
    },
    "context7": {
      "url": "https://mcp.context7.com/mcp",
      "headers": {
        "CONTEXT7_API_KEY": "your-context7-api-key"
      }
    }
  }
}
```

## Editor setup (optional)

Paste the same three servers into your editor MCP config. Replace placeholder keys. Do not invent a fourth server here.

<details>
<summary>Cursor (~/.cursor/mcp.json)</summary>

```json
{
  "mcpServers": {
    "astro-docs": {
      "url": "https://mcp.docs.astro.build/mcp"
    },
    "render": {
      "url": "https://mcp.render.com/mcp",
      "headers": {
        "Authorization": "Bearer <YOUR_RENDER_API_KEY>"
      }
    },
    "context7": {
      "url": "https://mcp.context7.com/mcp",
      "headers": {
        "CONTEXT7_API_KEY": "<YOUR_CONTEXT7_API_KEY>"
      }
    }
  }
}
```

See also the [Cursor MCP docs](https://docs.cursor.com/context/model-context-protocol).

</details>

<details>
<summary>Claude Desktop / Cline / Antigravity</summary>

Use the same `mcpServers` object as above in:

- Claude Desktop: `claude_desktop_config.json`
- Cline: `cline_mcp_settings.json`
- Antigravity: `~/.gemini/antigravity/mcp_config.json`

For Context7 alone you can also run `npx ctx7 setup` and follow its prompts.

</details>

## Out of scope

- Adding new `mcpServers` keys to this repo
- Documenting Cloudflare as anything other than production
- Treating Render MCP as a path to ship or fail over prod
- Visitor essays, hire email/CV, or GitHub Pages
