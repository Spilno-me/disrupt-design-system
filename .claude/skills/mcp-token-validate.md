# Validate Token Usage



**Category:** mcp | **Tags:** mcp, tokens, validation, compliance
**Variables:** `{TOKEN}`

---

Validate token usage: {TOKEN}

## MCP Validation
```
// Check if token is valid
mcp__dds__check_token_usage({ token: "{TOKEN}" })

// If invalid, get alternatives
mcp__dds__list_color_tokens({ category: "semantic" })
mcp__dds__get_design_tokens({ category: "colors" })
```

## Common Violations & Fixes
| Violation | MCP Suggestion |
|-----------|----------------|
| `bg-white` | `bg-surface` |
| `text-gray-500` | `text-muted` |
| `#FF0000` | `text-error` |
| `bg-blue-500` | `bg-accent-strong` |
| `border-gray-300` | `border-default` |

## Validation Workflow
1. Run `check_token_usage` for each suspect token
2. MCP returns: VALID, INVALID, or SUGGESTION
3. If invalid, use suggested semantic alternative
4. For contrast concerns, also run `check_contrast`

OUTPUT: MCP validation result + recommended replacement.

---

*Auto-generated from `prompts.ts` — edit source, run `npm run sync:prompts`*
