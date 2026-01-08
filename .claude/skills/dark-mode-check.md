# Verify Dark Mode Compatibility



**Category:** styling | **Tags:** dark-mode, themes, colors, mcp
**Variables:** `{COMPONENT}`
**Read first:** `.claude/dark-mode-mapping-rules.md`

---

Verify dark mode compatibility for {COMPONENT}.

## MCP Dark Mode Contrast Checks (REQUIRED)
```
// Verify text on dark backgrounds
mcp__dds__check_contrast({ background: "ABYSS[900]", foreground: "SLATE[100]" })
mcp__dds__check_contrast({ background: "ABYSS[800]", foreground: "SLATE[200]" })

// Find accessible colors for dark mode
mcp__dds__get_accessible_colors({ background: "ABYSS[900]", minLevel: "AA" })

// Get dark background guidance
mcp__dds__get_color_guidance({ category: "dark_backgrounds" })
```

READ: `.claude/dark-mode-mapping-rules.md`

Formula: Dark = 950 - Light
| Light | Dark |
|-------|------|
| 50 | 900 |
| 100 | 800 |
| 500 | 400 |

Semantic Tokens (auto-switch):
| Token | Light | Dark |
|-------|-------|------|
| `bg-page` | cream | ABYSS[900] |
| `bg-surface` | white | ABYSS[800] |
| `text-primary` | ABYSS[500] | SLATE[100] |
| `border-default` | SLATE[300] | SLATE[600] |

Status Colors (shift 1 step lighter in dark):
| Token | Light | Dark |
|-------|-------|------|
| `error` | CORAL[500] | CORAL[400] |
| `success` | HARBOR[500] | HARBOR[400] |

FORBIDDEN:
- Hardcoded: `isDark ? 'abyss[950]' : 'cream'`
- Raw hex in dark mode logic
- Dark backgrounds without MCP contrast verification

Use semantic tokens - they auto-switch themes.

OUTPUT: Dark mode compatible component + MCP contrast verification results.

---

*Auto-generated from `prompts.ts` — edit source, run `npm run sync:prompts`*
