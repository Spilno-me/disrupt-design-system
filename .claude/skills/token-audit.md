# Audit Token Usage



**Category:** tokens | **Tags:** tokens, audit, compliance, mcp
**Variables:** `{COMPONENT}`

---

Audit {COMPONENT} for token compliance.

## MCP-First Validation
For each suspected violation, run:
```
mcp__dds__check_token_usage({ token: "bg-white" })
mcp__dds__check_token_usage({ token: "#FF5733" })
mcp__dds__check_token_usage({ token: "text-red-500" })
```

## Check for:
1. Hardcoded hex colors -> MCP will suggest semantic token
2. Tailwind standard colors (red-500) -> MCP will suggest DDS equivalent
3. Hardcoded shadows -> use SHADOWS tokens
4. Hardcoded spacing -> use SPACING tokens
5. Hardcoded radius -> use RADIUS tokens

## Get Valid Tokens
```
mcp__dds__get_design_tokens({ category: "colors" })
mcp__dds__get_design_tokens({ category: "shadows" })
mcp__dds__get_design_tokens({ category: "spacing" })
```

Report findings in table format:
| Line | Violation | MCP Suggestion | Fix |
|------|-----------|----------------|-----|

---

*Auto-generated from `prompts.ts` — edit source, run `npm run sync:prompts`*
