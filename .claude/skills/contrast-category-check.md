# Check Contrast for Category



**Category:** mcp | **Tags:** mcp, contrast, category, wcag
**Variables:** `{CATEGORY}`

---

Check all contrast options for {CATEGORY} backgrounds.

## MCP Comprehensive Check
```
// Get category-specific guidance
mcp__dds__get_color_guidance({ category: "{CATEGORY}" })

// Get all accessible colors for common backgrounds in category
// For dark_backgrounds:
mcp__dds__get_accessible_colors({ background: "ABYSS[900]", minLevel: "AA" })
mcp__dds__get_accessible_colors({ background: "ABYSS[800]", minLevel: "AA" })
mcp__dds__get_accessible_colors({ background: "DEEP_CURRENT[800]", minLevel: "AA" })

// For light_backgrounds:
mcp__dds__get_accessible_colors({ background: "white", minLevel: "AA" })
mcp__dds__get_accessible_colors({ background: "CREAM", minLevel: "AA" })
```

## Category Reference
| Category | Common Backgrounds |
|----------|-------------------|
| `dark_backgrounds` | ABYSS[700-900], DEEP_CURRENT[700-900] |
| `light_backgrounds` | white, CREAM, SLATE[50-100] |
| `accent_backgrounds` | DEEP_CURRENT[500], HARBOR[500] |
| `semantic_error` | CORAL[500], CORAL[100] |

## Output Format
| Background | Foreground | Ratio | Level |
|------------|------------|-------|-------|
| ABYSS[900] | white | 12.5:1 | AAA ✓ |
| ABYSS[900] | SLATE[200] | 7.2:1 | AAA ✓ |
| ABYSS[900] | SLATE[400] | 4.1:1 | AA ✗ |

OUTPUT: Full contrast matrix for category.

---

*Auto-generated from `prompts.ts` — edit source, run `npm run sync:prompts`*
