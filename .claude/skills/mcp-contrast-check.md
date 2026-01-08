# Check Color Contrast (WCAG)



**Category:** mcp | **Tags:** mcp, contrast, wcag, accessibility
**Variables:** `{BACKGROUND}`, `{FOREGROUND}`

---

Check WCAG contrast for {BACKGROUND} background with {FOREGROUND} text.

## MCP Contrast Verification
```
// Primary check
mcp__dds__check_contrast({ background: "{BACKGROUND}", foreground: "{FOREGROUND}" })

// Find all accessible alternatives
mcp__dds__get_accessible_colors({ background: "{BACKGROUND}", minLevel: "AA" })
mcp__dds__get_accessible_colors({ background: "{BACKGROUND}", minLevel: "AAA" })
```

## WCAG Requirements
| Level | Ratio | Use Case |
|-------|-------|----------|
| AA | 4.5:1 | Normal text (minimum) |
| AA Large | 3:1 | 18px+ or 14px bold |
| AAA | 7:1 | Enhanced accessibility |

## Common Dark Background Safe Colors
| Background | Safe Text |
|------------|-----------|
| ABYSS[900] | white, SLATE[100-200], CREAM |
| ABYSS[800] | white, SLATE[100-300] |
| DEEP_CURRENT[800] | white, DEEP_CURRENT[50-200] |

## If Contrast Fails
1. Use lighter text shade (e.g., SLATE[300] → SLATE[200])
2. Use white for maximum contrast
3. Consider different background

OUTPUT: MCP contrast result + recommendation.

---

*Auto-generated from `prompts.ts` — edit source, run `npm run sync:prompts`*
