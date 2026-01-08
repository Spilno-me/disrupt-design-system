# Find All Token Violations



**Category:** review | **Tags:** audit, search, violations, mcp

---

Find all token violations in src/components.

## MCP Validation Workflow
For each violation found, validate with:
```
mcp__dds__check_token_usage({ token: "violation" })
```

## Search for:
1. Hardcoded hex colors (#[0-9A-Fa-f]{6})
2. Tailwind standard colors (red-500, blue-600, etc.)
3. Hardcoded px values outside tokens
4. font-mono or font-serif (should use Fixel only)

## Get Replacement Suggestions
```
mcp__dds__get_design_tokens({ category: "colors" })
mcp__dds__list_color_tokens({ category: "semantic" })
```

Report:
| File | Line | Violation | MCP Suggestion | Fix |
|------|------|-----------|----------------|-----|

Group by severity and provide fix commands where possible.

---

*Auto-generated from `prompts.ts` — edit source, run `npm run sync:prompts`*
