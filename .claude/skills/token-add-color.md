# Add New Color Token



**Category:** tokens | **Tags:** tokens, colors, sync, mcp
**Variables:** `{TOKEN_NAME}`, `{HEX_VALUE}`

---

Add a new color token: {TOKEN_NAME} with value {HEX_VALUE}

## PRE-FLIGHT: MCP Contrast Verification (REQUIRED)
```
// Check new color works on common backgrounds
mcp__dds__check_contrast({ background: "white", foreground: "{HEX_VALUE}" })
mcp__dds__check_contrast({ background: "ABYSS[900]", foreground: "{HEX_VALUE}" })
mcp__dds__check_contrast({ background: "{HEX_VALUE}", foreground: "white" })

// List existing tokens to avoid duplicates
mcp__dds__list_color_tokens({ category: "all" })
```

MUST UPDATE ALL 3 FILES (manual sync required):
1. `src/constants/designTokens.ts` - TypeScript source
2. `src/styles.css` - @theme block
3. `tailwind-preset.js` - for NPM consumers

After changes, run:
- `npm run validate:tokens` - verify sync
- `npm run health` - full check

OUTPUT: Include MCP contrast results in commit message.

---

*Auto-generated from `prompts.ts` — edit source, run `npm run sync:prompts`*
