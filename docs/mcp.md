# Model Context Protocol (MCP) Setup

This project supports MCP servers to provide AI agents with real-time context and tools for development and deployment.

## Render MCP Server

The Render MCP server allows AI agents to manage Cloud Services and debug applications directly from your editor.

### 1. Cursor Setup

Add the following configuration to `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "render": {
      "url": "https://mcp.render.com/mcp",
      "headers": {
        "Authorization": "Bearer <YOUR_API_KEY>"
      }
    }
  }
}
```

Replace `<YOUR_API_KEY>` with your Render API key. For more details, see the [Cursor MCP documentation](https://docs.cursor.com/context/model-context-protocol).

### 2. Antigravity Setup

1. Open the MCP store via the "..." dropdown at the top of the editor's agent panel.
2. Click on "Manage MCP Servers" -> "View raw config".
3. Modify the `mcp_config.json` (located at `~/.gemini/antigravity/mcp_config.json`) with the following:

```json
{
  "mcpServers": {
    "render": {
      "url": "https://mcp.render.com/mcp",
      "headers": {
        "Authorization": "Bearer <YOUR_API_KEY>"
      }
    }
  }
}
```

### 3. Codex / Cline Setup

If you are using the Cline (formerly Claude Dev) extension in VS Code:

1. Open the Cline MCP settings file:
   - macOS: `~/Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`
   - Windows: `%APPDATA%\Code\User\globalStorage\saoudrizwan.claude-dev\settings\cline_mcp_settings.json`
2. Add the "render" entry to the `mcpServers` object:

```json
{
  "mcpServers": {
    "render": {
      "url": "https://mcp.render.com/mcp",
      "headers": {
        "Authorization": "Bearer <YOUR_API_KEY>"
      }
    }
  }
}
```

### 4. Claude Desktop Setup

1. Open your Claude Desktop configuration file:
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
2. Add the following to the `mcpServers` object:

```json
{
  "mcpServers": {
    "render": {
      "url": "https://mcp.render.com/mcp",
      "headers": {
        "Authorization": "Bearer <YOUR_API_KEY>"
      }
    }
  }
}
```

## Astro Docs MCP Server

This repo also references the Astro Docs MCP server in `mcp_config.json`:

```json
{
  "astro-docs": {
    "url": "https://mcp.docs.astro.build/mcp"
  }
}
```

You can add this to your preferred editor's MCP configuration to give the AI access to the latest Astro documentation.

## Context7 MCP Server

Context7 provides up-to-date, version-specific documentation and code examples straight from the source.

### 1. Cursor Setup

Add the following to your Cursor MCP settings:

```json
{
  "mcpServers": {
    "context7": {
      "url": "https://mcp.context7.com/mcp",
      "headers": {
        "CONTEXT7_API_KEY": "<YOUR_API_KEY>"
      }
    }
  }
}
```

### 2. Claude Desktop Setup

Add the following to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "context7": {
      "url": "https://mcp.context7.com/mcp",
      "headers": {
        "CONTEXT7_API_KEY": "<YOUR_API_KEY>"
      }
    }
  }
}
```

### 3. Automated Setup

You can also set up Context7 for your coding agents using the CLI:

```bash
npx ctx7 setup
```

Follow the prompts to authenticate and configure your preferred agent (Cursor, Claude Code, etc.).
