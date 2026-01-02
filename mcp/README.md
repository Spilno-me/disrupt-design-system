# @dds/mcp - Disrupt Design System MCP Server

**Version:** 1.0.0  
**Status:** Phase 1 - Foundation

MCP (Model Context Protocol) server that enables AI assistants to follow DDS rules precisely when building components or integrating them into consumer applications.

## Purpose

| Use Case | What MCP Provides |
|----------|-------------------|
| **DDS Component Development** | Component metadata, token validation, color guidance |
| **Consumer App Integration** | Correct component usage, semantic tokens, design philosophy |

## Current Tools (Phase 1)

| Tool | Description | Example |
|------|-------------|---------|
| `get_component` | Component info (variants, status, path) | `get_component({name: "Button"})` |
| `search_components` | Search by name/type/status | `search_components({type: "ATOM", status: "STABILIZED"})` |
| `get_design_tokens` | Token values for colors/shadows/radius | `get_design_tokens({category: "shadows"})` |
| `get_color_guidance` | Color rules for background types | `get_color_guidance({category: "dark_backgrounds"})` |
| `check_token_usage` | Validate if token is DDS-compliant | `check_token_usage({token: "bg-blue-500"})` |
| `get_design_philosophy` | Wu Wei principles and rules | `get_design_philosophy({})` |
| `check_contrast` | WCAG contrast ratio between colors | `check_contrast({background: "ABYSS[900]", foreground: "PRIMITIVES.white"})` |
| `get_accessible_colors` | Find colors that pass WCAG | `get_accessible_colors({background: "ABYSS[900]", minLevel: "AAA"})` |
| `list_color_tokens` | List available color tokens | `list_color_tokens({filter: "ABYSS"})` |

## Installation

```bash
cd mcp
npm install
npm run build
```

## Configuration

### Project-level (`.mcp.json` in DDS root)
```json
{
  "mcpServers": {
    "dds": {
      "command": "node",
      "args": ["./mcp/dist/index.js"]
    }
  }
}
```

### Claude Code Settings (`.claude/settings.local.json`)
```json
{
  "enableAllProjectMcpServers": true,
  "enabledMcpjsonServers": ["dds"]
}
```

## How It Works

```
┌─────────────────────────────────────────────────────────┐
│                    AI Assistant                          │
│  "Build a Card component with error state"              │
└─────────────────────┬───────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        ▼             ▼             ▼
┌───────────┐  ┌───────────┐  ┌───────────┐
│get_component│  │check_token│  │get_color_ │
│("AppCard") │  │("text-    │  │guidance   │
│            │  │ error")   │  │("semantic │
│            │  │           │  │ _error")  │
└─────┬─────┘  └─────┬─────┘  └─────┬─────┘
      │              │              │
      └──────────────┼──────────────┘
                     │
                     ▼
        ┌─────────────────────────┐
        │  .claude/ source files  │
        │  - agent-context.json   │
        │  - color-matrix.json    │
        └─────────────────────────┘
```

## Data Sources

| Tool | Reads From |
|------|------------|
| `get_component`, `search_components` | `.claude/agent-context.json` → components.registry |
| `get_design_tokens` | `.claude/agent-context.json` → colors, shadows, radius |
| `get_color_guidance` | `.claude/color-matrix.json` |
| `check_token_usage` | `.claude/agent-context.json` → criticalRules.tokens |
| `get_design_philosophy` | `.claude/agent-context.json` → criticalRules.philosophy |
| `check_contrast`, `get_accessible_colors`, `list_color_tokens` | `.claude/contrast-matrix.json` |

## Development

```bash
# Run in development mode (no build needed)
npm run dev

# Build for production
npm run build

# Test tools manually
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node dist/index.js
```

## Testing Individual Tools

```bash
# List all tools
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node dist/index.js

# Get component info
echo '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"get_component","arguments":{"name":"Button"}}}' | node dist/index.js

# Check token validity
echo '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"check_token_usage","arguments":{"token":"bg-blue-500"}}}' | node dist/index.js

# Check contrast ratio between colors
echo '{"jsonrpc":"2.0","id":4,"method":"tools/call","params":{"name":"check_contrast","arguments":{"background":"ABYSS[900]","foreground":"PRIMITIVES.white"}}}' | node dist/index.js

# Find accessible colors for a background
echo '{"jsonrpc":"2.0","id":5,"method":"tools/call","params":{"name":"get_accessible_colors","arguments":{"background":"PRIMITIVES.white","minLevel":"AAA","limit":5}}}' | node dist/index.js
```

## Testing Contrast Tools

```bash
# Run unit tests for contrast tool logic
node test-tool-logic.js

# Run data integrity tests
node test-contrast-tools.js
```

## Roadmap

See [ROADMAP.md](./ROADMAP.md) for the full development plan.

## Architecture

```
mcp/
├── src/
│   └── index.ts      # Main server with all tools
├── dist/             # Compiled output
├── package.json      # Dependencies
├── tsconfig.json     # TypeScript config
├── README.md         # This file
└── ROADMAP.md        # Development roadmap
```
