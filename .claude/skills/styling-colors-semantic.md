# Apply Semantic Color Tokens



**Category:** styling | **Tags:** colors, tokens, semantic, mcp, maya
**Variables:** `{COMPONENT}`
**Read first:** `.claude/css-styling-rules.md`

---

Apply semantic color rules to {COMPONENT}.

## MAYA Mindset
- Semantic colors convey meaning—red = error, green = success, users already know
- Consistent token usage creates visual language users recognize
- Modern color palette, familiar meaning conventions

## MCP-First Color Workflow (REQUIRED)
```
// Step 1: Check if current token is valid
mcp__dds__check_token_usage({ token: "current-color-class" })

// Step 2: Get semantic alternatives
mcp__dds__list_color_tokens({ category: "semantic" })

// Step 3: Get color guidance for context
mcp__dds__get_color_guidance({ category: "light_backgrounds" })
mcp__dds__get_color_guidance({ category: "dark_backgrounds" })

// Step 4: Verify contrast for dark backgrounds
mcp__dds__check_contrast({ background: "ABYSS[900]", foreground: "text-color" })
mcp__dds__get_accessible_colors({ background: "ABYSS[900]", minLevel: "AA" })
```

READ: `.claude/css-styling-rules.md`

TOKEN PRIORITY (ALWAYS follow this order):
| Priority | Type | Example | When |
|----------|------|---------|------|
| 1st | Semantic | `text-warning`, `bg-error` | Color conveys meaning |
| 2nd | Contextual | `text-primary`, `bg-surface` | UI structure |
| 3rd | Primitive | `text-abyss-500` | ONLY when neither fits |

Examples:
```tsx
// ✅ Semantic - self-documenting
<Badge className="border-warning text-warning">Investigation</Badge>

// ❌ Primitive - meaning unclear
<Badge className="border-amber-500 text-amber-600">Investigation</Badge>
```

FORBIDDEN:
- Standard Tailwind colors (`red-500`, `blue-600`)
- Hardcoded hex values
- Same color family on itself (invisible: `bg-abyss-500 text-abyss-400`)
- Dark backgrounds without MCP contrast verification

OUTPUT: Updated component with semantic-first color tokens + MCP validation results.

---

*Auto-generated from `prompts.ts` — edit source, run `npm run sync:prompts`*
