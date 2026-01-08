# Get Color Recommendations



**Category:** mcp | **Tags:** mcp, colors, guidance, tokens
**Variables:** `{CONTEXT}`

---

Get color recommendations for {CONTEXT}.

## MCP Color Queries
```
// Get guidance for context
mcp__dds__get_color_guidance({ category: "{CONTEXT}" })

// List available tokens
mcp__dds__list_color_tokens({ category: "semantic" })
mcp__dds__list_color_tokens({ category: "contextual" })
mcp__dds__list_color_tokens({ category: "primitive" })

// Get all design tokens
mcp__dds__get_design_tokens({ category: "colors" })
```

## Available Contexts
| Context | Use For |
|---------|---------|
| `dark_backgrounds` | Text/icons on ABYSS[700-900] |
| `light_backgrounds` | Text/icons on white/cream |
| `accent_backgrounds` | Text on colored backgrounds |
| `semantic_error` | Error states |
| `semantic_success` | Success states |
| `semantic_warning` | Warning states |

## Token Priority
1. **Semantic** (text-error, bg-warning) - conveys meaning
2. **Contextual** (text-primary, bg-surface) - UI structure
3. **Primitive** (text-abyss-500) - only when neither fits

OUTPUT: MCP color recommendations for context.

---

*Auto-generated from `prompts.ts` — edit source, run `npm run sync:prompts`*
